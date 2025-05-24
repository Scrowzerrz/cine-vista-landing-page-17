
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export type UserRole = 'admin' | 'moderator' | 'user';

export const useUserRole = () => {
  const { user } = useAuth();
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setRoles([]);
      setLoading(false);
      return;
    }

    const fetchUserRoles = async () => {
      try {
        // Use a função RPC que criamos para evitar recursão infinita
        const { data: isAdminData, error: adminError } = await supabase
          .rpc('is_user_admin', { user_id_param: user.id });

        if (adminError) {
          console.error('Error checking admin status:', adminError);
          setRoles([]);
          setLoading(false);
          return;
        }

        // Se é admin, buscar todas as roles do usuário
        if (isAdminData) {
          const { data, error } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', user.id);

          if (error) {
            console.error('Error fetching user roles:', error);
            setRoles([]);
          } else {
            setRoles(data?.map(item => item.role as UserRole) || []);
          }
        } else {
          // Se não é admin, verificar se tem outras roles específicas
          setRoles(['user']); // Role padrão
        }
      } catch (error) {
        console.error('Error fetching user roles:', error);
        setRoles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRoles();
  }, [user]);

  const hasRole = (role: UserRole) => roles.includes(role);
  const isAdmin = () => hasRole('admin');
  const isModerator = () => hasRole('moderator');

  return {
    roles,
    loading,
    hasRole,
    isAdmin,
    isModerator
  };
};
