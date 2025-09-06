import React from "react";

export function Table({ children }: { children: React.ReactNode }) {
  return <table className="w-full border-collapse text-sm text-left">{children}</table>;
}
export function TableHeader({ children }: { children: React.ReactNode }) {
  return <thead className="bg-gray-900 text-white">{children}</thead>;
}
export function TableRow({ children }: { children: React.ReactNode }) {
  return <tr className="border-b border-gray-800">{children}</tr>;
}
export function TableCell({ children }: { children: React.ReactNode }) {
  return <td className="px-2 py-1">{children}</td>;
}
export function TableBody({ children }: { children: React.ReactNode }) {
  return <tbody>{children}</tbody>;
}
