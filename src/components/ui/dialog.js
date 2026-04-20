import React from "react";

export function Dialog({ open, children }) {
  if (!open) return null;
  return <>{children}</>;
}

export function DialogTrigger({ asChild, children }) {
  return children;
}

export function DialogContent({ children, className = "" }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className={`w-full max-w-lg rounded-xl bg-white p-6 shadow-xl ${className}`}>
        {children}
      </div>
    </div>
  );
}

export function DialogHeader({ children }) {
  return <div className="mb-4">{children}</div>;
}

export function DialogTitle({ children }) {
  return <h2 className="text-lg font-semibold">{children}</h2>;
}