
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
  const [loading, setLoading] = useState(true); // Loading da sessão
  const [profileLoading, setProfileLoading] = useState(true); // Loading do perfil
  // Adicionando logs para mudança de estado de loading
  const _setLoading = (val: boolean) => {
    console.log('AuthContext: setLoading (session) ->', val);
    setLoading(val);
  }
  const _setProfileLoading = (val: boolean) => {
    console.log('AuthContext: setProfileLoading ->', val);
    setProfileLoading(val);
  }


  // useEffect para autenticação (sessão)
  useEffect(() => {
    console.log('=== AUTH EFFECT SETUP ===');
    let mounted = true;

    // Função para buscar perfil do usuário
    // Modificada para remover 'mounted' e retornar dados ou null
    const fetchProfile = async (userId: string): Promise<any | null> => {
      console.log('Fetching profile for user:', userId);
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .maybeSingle();
        
        if (error) {
          console.error('Error fetching profile in fetchProfile:', error);
          return null; // Retorna null em caso de erro
        }
        console.log('Profile data fetched in fetchProfile:', data);
        return data; // Retorna os dados do perfil
      } catch (error) {
        console.error('Exception in fetchProfile:', error);
        return null; // Retorna null em caso de exceção
      }
    };

    // Configurar listener de mudanças de auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => { // Removido async pois fetchProfile não é mais awaited aqui
        if (!mounted) return;

        console.log('=== AUTH STATE CHANGE ===');
        console.log('Event:', event);
        console.log('Session exists:', !!session);
        console.log('User:', session?.user?.email);
        
        setSession(session);
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        
        // fetchProfile e setProfile(null) removidos daqui
        
        _setLoading(false); // Indica que o estado de autenticação (sessão) foi processado
        console.log('Auth state change processed, session loading set to false. User set to:', currentUser?.email);
      }
    );

    // Verificar sessão existente
    const getInitialSession = async () => {
      console.log('Getting initial session...');
      _setLoading(true); // Inicia o carregamento da sessão
      try {
        const { data: { session: initialSessionData }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting initial session:', error);
          // setUser e setSession serão null por padrão ou pelo catch
          // Limpar user/session explicitamente se já existiam e a chamada falha
          if (mounted) {
            setSession(null);
            setUser(null);
          }
          return;
        }

        console.log('Initial session result:', !!initialSessionData, initialSessionData?.user?.email);

        if (mounted) {
          setSession(initialSessionData);
          setUser(initialSessionData?.user ?? null);
          // fetchProfile removido daqui
        }
      } catch (error) {
        console.error('Exception in getInitialSession:', error);
        if (mounted) {
          setSession(null);
          setUser(null);
          // setProfile(null) removido daqui
        }
      } finally {
        if (mounted) {
          _setLoading(false); // Finaliza o carregamento da sessão
          console.log('Initial session processing finished, session loading set to false (finally)');
        }
      }
    };

    // Inicializar auth state
    getInitialSession();

    // Cleanup
    return () => {
      console.log('AuthContext cleanup');
      mounted = false;
      subscription.unsubscribe();
    };
  }, []); // Este useEffect roda apenas uma vez

  // useEffect para buscar perfil (profileEffects)
  useEffect(() => {
    let mounted = true; // Variável local para este useEffect
    console.log('PROFILE EFFECT: Effect triggered. User:', user?.email, 'Mounted:', mounted);

    if (user?.id) { // Verifica se user e user.id existem
      _setProfileLoading(true); // Começa a carregar o perfil
      console.log('PROFILE EFFECT: User found, fetching profile for', user.id);
      fetchProfile(user.id).then(profileData => {
        if (mounted) {
          console.log('PROFILE EFFECT: Profile fetched, data:', profileData);
          setProfile(profileData);
          _setProfileLoading(false); // Terminou de carregar o perfil
        } else {
          console.log('PROFILE EFFECT: Component unmounted before profile could be set.');
        }
      });
    } else {
      console.log('PROFILE EFFECT: No user or user.id, clearing profile.');
      setProfile(null);
      _setProfileLoading(false); // Não há perfil para carregar ou usuário deslogado
    }

    return () => {
      console.log('PROFILE EFFECT: Cleanup. User was:', user?.email);
      mounted = false; // Cleanup para este useEffect
    };
  }, [user]); // Depende do objeto user

  // Função fetchProfile movida para fora do useEffect de autenticação para ser acessível pelo profileEffects
  // Mantida dentro do escopo do AuthProvider para ter acesso ao supabase client
  const fetchProfile = async (userId: string): Promise<any | null> => {
    console.log('Fetching profile for user:', userId);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile in fetchProfile:', error);
        return null; // Retorna null em caso de erro
      }
      console.log('Profile data fetched in fetchProfile:', data);
      return data; // Retorna os dados do perfil
    } catch (error) {
      console.error('Exception in fetchProfile:', error);
      return null; // Retorna null em caso de exceção
    }
  };

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
    loading: loading || profileLoading, // Combinação dos dois loadings
    signOut,
  };

  console.log('AuthContext render state:', { 
    hasUser: !!user, 
    hasSession: !!session, 
    hasProfile: !!profile, 
    sessionLoading: loading, // Renomeado para clareza no log
    profileLoading,
    combinedLoading: loading || profileLoading,
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
