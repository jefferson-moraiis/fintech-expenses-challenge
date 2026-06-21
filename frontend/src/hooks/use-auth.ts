import { useMutation } from '@tanstack/react-query';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'sonner';
import { authApi } from '@/api/auth';
import { useAuth as useAuthContext } from '@/contexts/auth.context';
import type { AuthUser, LoginPayload, RegisterPayload } from '@/types/auth.types';

export { useAuth } from '@/contexts/auth.context';

export function useLogin() {
  const { login } = useAuthContext();

  return useMutation({
    mutationFn: (data: LoginPayload) => authApi.login(data),
    onSuccess: (response) => {
      const token = response.data.access_token;
      const user = jwtDecode<AuthUser>(token);

      login(token, user);
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      const message = error?.response?.data?.message ?? 'Credenciais inválidas';
      toast.error(message);
    },
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: (data: RegisterPayload) => authApi.register(data),
    onError: (error: { response?: { data?: { message?: string }; status?: number } }) => {
      if (error?.response?.status === 409) {
        toast.error('E-mail já cadastrado');
      } else {
        const message = error?.response?.data?.message ?? 'Erro ao criar conta';
        toast.error(message);
      }
    },
  });
}