
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
    const fetchUserRoles = async () => {
      console.log('fetchUserRoles called with:', { user: user?.id, authLoading });
      
      // Se ainda está carregando auth, aguardar
      if (authLoading) {
        console.log('Auth still loading, waiting...');
        setLoading(true);
        setError(null);
        return;
      }

      // Se não tem usuário, definir como usuário comum
      if (!user) {
        console.log('No user found, setting as regular user');
        setRoles(['user']);
        setLoading(false);
        setError(null);
        return;
      }

      console.log('Fetching roles for user:', user.id, user.email);

      try {
        setLoading(true);
        setError(null);
        
        // Usar a nova função get_user_roles
        const { data: userRoles, error: rolesError } = await supabase
          .rpc('get_user_roles', { user_id_param: user.id });

        if (rolesError) {
          console.error('Error fetching user roles:', rolesError);
          // Se houver erro, definir como usuário comum
          setRoles(['user']);
          setError('Erro ao buscar roles do usuário');
        } else {
          console.log('Raw roles data:', userRoles);
          
          if (userRoles && userRoles.length > 0) {
            const rolesList = userRoles.map((r: any) => r.role_name as UserRole);
            console.log('Processed roles:', rolesList);
            setRoles(rolesList);
          } else {
            // Se não tem roles específicas, é usuário comum
            console.log('No specific roles found, setting as regular user');
            setRoles(['user']);
          }
        }
      } catch (error) {
        console.error('Exception in fetchUserRoles:', error);
        setError('Erro ao verificar permissões');
        // Em caso de erro, definir como usuário comum para não bloquear acesso
        setRoles(['user']);
      } finally {
        setLoading(false);
        console.log('fetchUserRoles completed');
      }
    };

    fetchUserRoles();
  }, [user?.id, authLoading]);

  const hasRole = (role: UserRole) => {
    const result = roles.includes(role);
    console.log(`Checking role ${role}:`, result, 'Current roles:', roles);
    return result;
  };
  
  const isAdmin = () => hasRole('admin');
  const isModerator = () => hasRole('moderator');

  console.log('useUserRole final state:', { 
    userId: user?.id, 
    roles, 
    loading, 
    error, 
    authLoading 
  });

  return {
    roles,
    loading,
    error,
    hasRole,
    isAdmin,
    isModerator
  };
};
