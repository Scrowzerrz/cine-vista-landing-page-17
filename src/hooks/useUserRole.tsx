
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
      console.log('=== fetchUserRoles START ===');
      console.log('Auth state:', { 
        hasUser: !!user, 
        userId: user?.id, 
        authLoading 
      });
      
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

      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching roles for user:', user.id);
        
        // Buscar roles na tabela user_roles
        const { data: userRoles, error: rolesError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id);

        console.log('Roles query result:', { userRoles, rolesError });

        if (rolesError) {
          console.error('Error fetching user roles:', rolesError);
          // Se houver erro, definir como usuário comum
          setRoles(['user']);
          setError('Erro ao buscar roles do usuário');
        } else {
          if (userRoles && userRoles.length > 0) {
            const rolesList = userRoles.map((r: any) => r.role as UserRole);
            console.log('Found roles:', rolesList);
            setRoles(rolesList);
          } else {
            // Se não tem roles específicas, é usuário comum
            console.log('No roles found in database, setting as regular user');
            setRoles(['user']);
          }
        }
      } catch (error) {
        console.error('Exception in fetchUserRoles:', error);
        setError('Erro ao verificar permissões');
        // Em caso de erro, definir como usuário comum
        setRoles(['user']);
      } finally {
        setLoading(false);
        console.log('=== fetchUserRoles END ===');
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
    authLoading,
    isAdmin: isAdmin()
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
