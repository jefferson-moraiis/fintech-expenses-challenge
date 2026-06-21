import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ArrowLeftRight,
  Tags,
  LogOut,
  Wallet,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner"
import { useAuth } from '@/contexts/auth.context';


const nav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/transactions", label: "Transações", icon: ArrowLeftRight },
  { to: "/categories", label: "Categorias", icon: Tags },
];

export function Sidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
  await toast.promise(
      (async () => {
        await logout();
        navigate("/login", { replace: true });
      })(),
      {
        loading: "Encerrando sessão...",
        success: "Sessão encerrada com sucesso!",
        error: "Erro ao encerrar sessão.",
      }
    );
  };

  return (
    <aside className="hidden w-60 border-r md:flex md:flex-col">
      <div className="flex h-14 items-center gap-2 border-b px-5">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <Wallet className="h-4 w-4" />
        </div>
        <span className="font-semibold">Finx</span>
      </div>
      <nav className="flex-1 space-y-1 p-3">
        <p className="px-2 pb-2 text-xs text-muted-foreground">Geral</p>
        {nav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                isActive && "bg-accent text-accent-foreground"
              )
            }
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </NavLink>
        ))}

        <Separator className="my-3" />

        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        >
          <LogOut  className="h-4 w-4" />
          Sair
        </button>
      </nav>
    </aside>
  );
}