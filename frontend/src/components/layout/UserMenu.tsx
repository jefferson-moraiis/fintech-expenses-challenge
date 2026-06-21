import { Link, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner"
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from '@/contexts/auth.context';



export function UserMenu() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const initials =
    user?.name?.slice(0, 2).toUpperCase() || "FN";

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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button>
          <Avatar className="h-8 w-8">
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Minha conta</DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link to="/categories">Categorias</Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link to="/transactions">Transações</Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleLogout}>
          Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}