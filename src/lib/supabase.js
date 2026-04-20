import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

console.log("SUPABASE URL:", supabaseUrl);
console.log("SUPABASE KEY EXISTS:", !!supabaseAnonKey);

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Faltam as variáveis REACT_APP_SUPABASE_URL e/ou REACT_APP_SUPABASE_ANON_KEY no ficheiro .env"
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);