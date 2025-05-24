
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
      console.log('🔍 fetchUserRoles called with:', { 
        userId: user?.id, 
        userEmail: user?.email,
        authLoading 
      });
      
      // Se ainda está carregando auth, aguardar
      if (authLoading) {
        console.log('⏳ Auth still loading, waiting...');
        return; // Não mudar o estado de loading aqui
      }

      // Se não tem usuário, definir como usuário comum e finalizar loading
      if (!user) {
        console.log('👤 No user found, setting as regular user');
        setRoles(['user']);
        setLoading(false);
        setError(null);
        return;
      }

      console.log('🔎 Fetching roles for user:', user.id, user.email);

      try {
        setLoading(true);
        setError(null);
        
        // Buscar roles do usuário
        const { data: userRoles, error: rolesError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id);

        if (rolesError) {
          console.error('❌ Error fetching user roles:', rolesError);
          setRoles(['user']);
          setError('Erro ao buscar roles do usuário');
        } else {
          console.log('📋 Raw roles data:', userRoles);
          
          if (userRoles && userRoles.length > 0) {
            const rolesList = userRoles.map((r: any) => r.role as UserRole);
            console.log('✅ Processed roles:', rolesList);
            setRoles(rolesList);
          } else {
            console.log('🔄 No specific roles found, setting as regular user');
            setRoles(['user']);
          }
        }
      } catch (error) {
        console.error('💥 Exception in fetchUserRoles:', error);
        setError('Erro ao verificar permissões');
        setRoles(['user']);
      } finally {
        setLoading(false);
        console.log('✨ fetchUserRoles completed - loading set to false');
      }
    };

    fetchUserRoles();
  }, [user?.id, authLoading]); // Dependências corretas

  const hasRole = (role: UserRole) => {
    const result = roles.includes(role);
    console.log(`🎯 Checking role ${role}:`, result, 'Current roles:', roles);
    return result;
  };
  
  const isAdmin = () => hasRole('admin');
  const isModerator = () => hasRole('moderator');

  console.log('🏁 useUserRole final state:', { 
    userId: user?.id, 
    userEmail: user?.email,
    roles, 
    loading, 
    error, 
    authLoading,
    isAdminResult: isAdmin()
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
