import React from "react";

export function Table({ children }: { children: React.ReactNode }) {
  return <table className="w-full border-collapse text-sm text-left">{children}</table>;
}
export function TableHeader({ children }: { children: React.ReactNode }) {
  return <thead className="bg-gray-900 text-white">{children}</thead>;
}
export function TableRow({ children, className }: { children: React.ReactNode; className?: string }) {
  return <tr className={className ? `border-b border-gray-800 ${className}` : "border-b border-gray-800"}>{children}</tr>;
}
export function TableCell({ children, className, colSpan }: { children: React.ReactNode; className?: string; colSpan?: number }) {
  return <td className={className ? `px-2 py-1 ${className}` : "px-2 py-1"} colSpan={colSpan}>{children}</td>;
}
export function TableBody({ children }: { children: React.ReactNode }) {
  return <tbody>{children}</tbody>;
}
