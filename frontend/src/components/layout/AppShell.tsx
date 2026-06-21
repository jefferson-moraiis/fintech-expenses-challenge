import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

interface AppShellProps {
  title: string;
  children: ReactNode;
}

export function AppShell({ title, children }: AppShellProps) {
  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      <Sidebar />

      <div className="flex flex-1 flex-col">
        <Header title={title} />

        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}