import { api } from './client';
import type { LoginPayload, RegisterPayload } from '@/types/auth.types';

interface AuthEnvelope {
  success: boolean;
  data: {
    access_token: string;
  };
}

export const authApi = {
  login: async (data: LoginPayload): Promise<AuthEnvelope> => {
    const response = await api.post<AuthEnvelope>('/auth/login', data);
    return response.data;
  },

  register: async (data: RegisterPayload): Promise<void> => {
    await api.post('/auth/register', data);
  },
};