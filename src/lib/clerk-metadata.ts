import { clerkClient } from '@clerk/nextjs/server';

// Tipos para metadata do usuário (compatível com Clerk)
export interface UserMetadata {
  hasColaborador?: boolean;
  colaboradorId?: string;
  userType?: 'colaborador' | 'admin';
  setupCompleted?: boolean;
  [key: string]: any; // Index signature para compatibilidade com Clerk
}

// Funções para gerenciar metadata do usuário
export const clerkMetadata = {
  
  // Marcar que o usuário completou o setup de colaborador
  async setColaboradorCompleted(userId: string, colaboradorId?: string): Promise<void> {
    try {
      const client = await clerkClient();
      await client.users.updateUserMetadata(userId, {
        publicMetadata: {
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

  // Verificar se o usuário tem colaborador (para usar no middleware)
  hasColaborador(user: any): boolean {
    return user?.publicMetadata?.hasColaborador === true;
  },

  // Obter ID do colaborador do metadata
  getColaboradorId(user: any): string | null {
    return user?.publicMetadata?.colaboradorId || null;
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