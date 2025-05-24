
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export type UserRole = 'admin' | 'moderator' | 'user';

export const useUserRole = () => {
  const { user, loading: authLoading } = useAuth();
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Se ainda está carregando auth ou não tem usuário, resetar estado
    if (authLoading) {
      setLoading(true);
      return;
    }

    if (!user) {
      setRoles([]);
      setLoading(false);
      setError(null);
      return;
    }

    const fetchUserRoles = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Primeiro verificar se é admin usando a função RPC
        const { data: isAdminData, error: adminError } = await supabase
          .rpc('is_user_admin', { user_id_param: user.id });

        if (adminError) {
          console.error('Error checking admin status:', adminError);
          // Se houver erro, definir como usuário comum
          setRoles(['user']);
          setLoading(false);
          return;
        }

        if (isAdminData) {
          // Se é admin, buscar todas as roles
          const { data: rolesData, error: rolesError } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', user.id);

          if (rolesError) {
            console.error('Error fetching user roles:', rolesError);
            // Se houver erro mas sabemos que é admin, pelo menos dar role de admin
            setRoles(['admin']);
          } else {
            const userRoles = rolesData?.map(item => item.role as UserRole) || ['admin'];
            setRoles(userRoles);
          }
        } else {
          // Se não é admin, definir como usuário comum
          setRoles(['user']);
        }
      } catch (error) {
        console.error('Error in fetchUserRoles:', error);
        setError('Erro ao verificar permissões');
        // Em caso de erro, definir como usuário comum para não bloquear acesso
        setRoles(['user']);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRoles();
  }, [user, authLoading]); // Dependências específicas para evitar loops

  const hasRole = (role: UserRole) => roles.includes(role);
  const isAdmin = () => hasRole('admin');
  const isModerator = () => hasRole('moderator');

  return {
    roles,
    loading,
    error,
    hasRole,
    isAdmin,
    isModerator
  };
};
