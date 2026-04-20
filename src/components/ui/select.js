import React from "react";

export function Select({ value, onValueChange, children }) {
  const items = React.Children.toArray(children).filter(
    (child) => child.type && child.type.displayName === "SelectContent"
  );

  let options = [];
  items.forEach((item) => {
    const inner = React.Children.toArray(item.props.children);
    inner.forEach((child) => {
      if (child.type && child.type.displayName === "SelectItem") {
        options.push({
          value: child.props.value,
          label: child.props.children,
        });
      }
    });
  });

  return (
    <select
      value={value}
      onChange={(e) => onValueChange?.(e.target.value)}
      className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}

export function SelectTrigger({ children, className = "" }) {
  return <div className={className}>{children}</div>;
}

export function SelectValue() {
  return null;
}

export function SelectContent({ children }) {
  return <>{children}</>;
}
SelectContent.displayName = "SelectContent";

export function SelectItem() {
  return null;
}
SelectItem.displayName = "SelectItem";