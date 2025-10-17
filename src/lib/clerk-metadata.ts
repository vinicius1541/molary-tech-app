import { clerkClient } from '@clerk/nextjs/server';

// Tipos para metadata do usuário (compatível com Clerk)
export interface UserMetadata {
  hasUsuario?: boolean;
  usuarioId?: string;
  hasColaborador?: boolean;
  colaboradorId?: string;
  userType?: 'colaborador' | 'admin';
  setupCompleted?: boolean;
  onboardingStep?: 'usuario' | 'colaborador' | 'completed';
  roles?: string[];
  permissions?: string[];
  [key: string]: any; // Index signature para compatibilidade com Clerk
}

// Funções para gerenciar metadata do usuário
export const clerkMetadata = {

  // Marcar que o usuário interno foi criado
  async setUsuarioCreated(userId: string, usuarioId: string): Promise<void> {
    try {
      const client = await clerkClient();
      await client.users.updateUserMetadata(userId, {
        publicMetadata: {
          hasUsuario: true,
          usuarioId,
          onboardingStep: 'colaborador',
        },
      });
    } catch (error) {
      console.error('Erro ao atualizar metadata do usuário interno:', error);
      throw new Error('Falha ao registrar usuário interno');
    }
  },
  
  // Marcar que o usuário completou o setup de colaborador
  async setColaboradorCompleted(userId: string, colaboradorId?: string): Promise<void> {
    try {
      const client = await clerkClient();
      await client.users.updateUserMetadata(userId, {
        publicMetadata: {
          hasUsuario: true,
          onboardingStep: 'completed',
          hasColaborador: true,
          colaboradorId: colaboradorId,
          userType: 'colaborador',
          setupCompleted: true,
        },
      });
    } catch (error) {
      console.error('Erro ao atualizar metadata do usuário:', error);
      throw new Error('Falha ao marcar setup como completo');
    }
  },

  hasUsuario(user: any): boolean {
    return user?.publicMetadata?.hasUsuario === true;
  },

  getUsuarioId(user: any): string | null {
    return user?.publicMetadata?.usuarioId || null;
  },

  // Verificar se o usuário tem colaborador (para usar no middleware)
  hasColaborador(user: any): boolean {
    return user?.publicMetadata?.hasColaborador === true;
  },

  // Obter ID do colaborador do metadata
  getColaboradorId(user: any): string | null {
    return user?.publicMetadata?.colaboradorId || null;
  },

  async setAuthz(
    userId: string,
    payload: { roles: string[]; permissions: string[] }
  ): Promise<void> {
    try {
      const client = await clerkClient();
      await client.users.updateUserMetadata(userId, {
        publicMetadata: {
          roles: payload.roles,
          permissions: payload.permissions,
        },
      });
    } catch (error) {
      console.error('Erro ao sincronizar metadata de autorização:', error);
      throw new Error('Falha ao sincronizar permissões do usuário');
    }
  },

  getPermissions(user: any): string[] {
    const value = user?.publicMetadata?.permissions;
    return Array.isArray(value) ? (value as string[]) : [];
  },

  getRoles(user: any): string[] {
    const value = user?.publicMetadata?.roles;
    return Array.isArray(value) ? (value as string[]) : [];
  },

  // Verificar se setup foi completado
  isSetupCompleted(user: any): boolean {
    return user?.publicMetadata?.setupCompleted === true;
  },

  // Remover metadata (útil para reset)
  async clearColaboradorMetadata(userId: string): Promise<void> {
    try {
      const client = await clerkClient();
      await client.users.updateUserMetadata(userId, {
        publicMetadata: {
          hasUsuario: false,
          usuarioId: undefined,
          onboardingStep: 'usuario',
          hasColaborador: false,
          colaboradorId: undefined,
          userType: undefined,
          setupCompleted: false,
        },
      });
    } catch (error) {
      console.error('Erro ao limpar metadata do usuário:', error);
      throw new Error('Falha ao limpar metadata');
    }
  }
};