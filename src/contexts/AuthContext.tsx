
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: any | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('=== AUTH CONTEXT SETUP ===');
    let mounted = true;

    // Função para buscar perfil do usuário
    const fetchProfile = async (userId: string) => {
      try {
        console.log('Fetching profile for user:', userId);
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .maybeSingle();
        
        if (error) {
          console.error('Error fetching profile:', error);
        }
        
        if (mounted) {
          setProfile(data);
          console.log('Profile loaded:', data);
        }
      } catch (error) {
        // Adiciona um log mais específico para erros da query do Supabase
        console.error('Error querying profile in fetchProfile:', error);
        if (mounted) {
          setProfile(null);
        }
      }
    };

    // Configurar listener de mudanças de auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        console.log('=== AUTH STATE CHANGE ===');
        console.log('Event:', event);
        console.log('Session exists:', !!session);
        console.log('User:', session?.user?.email);
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          console.log('User logged in, fetching profile...');
          await fetchProfile(session.user.id);
        } else {
          console.log('User logged out, clearing profile');
          setProfile(null);
        }
        
        // Marcar como não carregando após processar
        setLoading(false);
        console.log('Auth state change processed, loading set to false');
      }
    );

    // Verificar sessão existente
    const getInitialSession = async () => {
      try {
        console.log('Getting initial session...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting initial session:', error);
          if (mounted) {
            setSession(null);
            setUser(null);
            // Movido para o bloco finally
          }
          return;
        }

        console.log('Initial session result:', !!session, session?.user?.email);

        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
          
          if (session?.user) {
            console.log('Initial session has user, fetching profile...');
            await fetchProfile(session.user.id);
          }
          // setLoading(false) removido daqui, pois será chamado no finally
        }
      } catch (error) {
        console.error('Exception in getInitialSession:', error);
        // As redefinições de estado em caso de erro também são movidas para o finally
        // para garantir que setLoading(false) seja chamado.
        // No entanto, é importante limpar o estado se houve um erro na obtenção da sessão.
        if (mounted) {
          setSession(null);
          setUser(null);
          setProfile(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
          console.log('Initial session processing finished, loading set to false (finally)');
        }
      }
    };

    // Inicializar
    getInitialSession();

    // Cleanup
    return () => {
      console.log('AuthContext cleanup');
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    console.log('Signing out...');
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error);
      } else {
        console.log('Signed out successfully');
      }
    } catch (error) {
      console.error('Exception in signOut:', error);
    }
  };

  const value = {
    session,
    user,
    profile,
    loading,
    signOut,
  };

  console.log('AuthContext render state:', { 
    hasUser: !!user, 
    hasSession: !!session, 
    hasProfile: !!profile, 
    loading,
    userEmail: user?.email
  });

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
