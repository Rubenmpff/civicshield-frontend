import React from "react";

export function Table({ children }) {
  return <table className="w-full border-collapse">{children}</table>;
}

export function TableHeader({ children }) {
  return <thead>{children}</thead>;
}

export function TableBody({ children }) {
  return <tbody>{children}</tbody>;
}

export function TableRow({ children, className = "" }) {
  return <tr className={className}>{children}</tr>;
}

export function TableHead({ children, className = "" }) {
  return <th className={`text-left p-4 ${className}`}>{children}</th>;
}

export function TableCell({ children, className = "" }) {
  return <td className={`p-4 border-t border-slate-200 ${className}`}>{children}</td>;
}