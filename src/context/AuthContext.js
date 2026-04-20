import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { supabase } from "../lib/supabase";

const AuthContext = createContext(null);

const normalizeUser = ({ authUser, profile, roles = [] }) => {
  if (!authUser) return null;

  const normalizedRoles = [...new Set(roles)].map((role) => {
    if (role === "citizen" || role === "vulnerable") return "requester";
    return role;
  });

  return {
    id: authUser.id,
    email: authUser.email,
    name:
      profile?.full_name ||
      authUser.user_metadata?.full_name ||
      authUser.user_metadata?.name ||
      authUser.email ||
      "",
    phone: profile?.phone || "",
    account_type: profile?.account_type || "individual",
    organization_name: profile?.organization_name || "",
    organization_type: profile?.organization_type || "",
    verification_status: profile?.verification_status || null,

    // 🔥 VOLUNTÁRIOS
    wants_volunteer: profile?.wants_volunteer ?? false,
    volunteer_status: profile?.volunteer_status || "none",

    is_active: profile?.is_active ?? true,
    roles: normalizedRoles.length ? normalizedRoles : ["requester"],
  };
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth tem de ser usado dentro de AuthProvider");
  }

  return context;
};

const fetchAppUser = async (authUser) => {
  if (!authUser) return null;

  const [profileRes, rolesRes] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", authUser.id).maybeSingle(),
    supabase.from("user_roles").select("role").eq("user_id", authUser.id),
  ]);

  let profile = null;
  let roles = [];

  if (!profileRes.error) profile = profileRes.data;
  if (!rolesRes.error)
    roles = (rolesRes.data || []).map((r) => r.role);

  return normalizeUser({
    authUser,
    profile,
    roles,
  });
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const hydrateUser = useCallback(async (authUser) => {
    if (!authUser) {
      setUser(null);
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }

    setIsAuthenticated(true);

    try {
      const appUser = await fetchAppUser(authUser);
      setUser(appUser);
    } catch (error) {
      console.error(error);
      setUser({
        id: authUser.id,
        email: authUser.email,
        name: authUser.email,
        wants_volunteer: false,
        volunteer_status: "none",
        roles: ["requester"],
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const checkAuth = useCallback(async () => {
    setLoading(true);

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user) {
      setUser(null);
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }

    await hydrateUser(session.user);
  }, [hydrateUser]);

  useEffect(() => {
    checkAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setTimeout(() => {
        if (!session?.user) {
          setUser(null);
          setIsAuthenticated(false);
          setLoading(false);
          return;
        }

        setLoading(true);
        hydrateUser(session.user);
      }, 0);
    });

    return () => subscription.unsubscribe();
  }, [checkAuth, hydrateUser]);

  const login = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
  };

  const register = async (
    name,
    email,
    password,
    roles = ["requester"],
    extraData = {}
  ) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
      },
    });

    if (error) throw error;

    const newUser = data.user;

    if (!newUser) throw new Error("Erro ao criar utilizador");

    // 🔥 FIX FINAL AQUI
    const profilePayload = {
      id: newUser.id,
      full_name: name,
      email,
      account_type: extraData.account_type || "individual",
      organization_name: extraData.organization_name || null,
      organization_type: extraData.organization_type || null,
      verification_status: extraData.verification_status || null,
      is_active: true,
      admin_request: extraData.admin_request || false,

      // 👇 ISTO É O MAIS IMPORTANTE
      wants_volunteer: extraData.wants_volunteer ?? false,
      volunteer_status: extraData.volunteer_status ?? "none",
    };

    const { error: profileError } = await supabase
      .from("profiles")
      .upsert(profilePayload);

    if (profileError) throw profileError;

    for (const role of roles) {
      await supabase.from("user_roles").upsert(
        {
          user_id: newUser.id,
          role,
        },
        { onConflict: "user_id,role" }
      );
    }

    return newUser;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsAuthenticated(false);
  };

  const hasRole = (role) => user?.roles?.includes(role);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        login,
        register,
        logout,
        checkAuth,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;