
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginForm } from '@/components/auth/LoginForm';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const Auth = () => {
  const [view, setView] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        navigate('/');
      }
      setLoading(false);
    };
    
    checkSession();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event) => {
        if (event === 'SIGNED_IN') {
          navigate('/');
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="w-16 h-16 border-4 border-t-red-500 border-gray-700 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex items-center justify-center">
          <span className="text-4xl font-bold text-white flex items-center">
            POBRE<span className="text-red-500">FLIX</span>
          </span>
        </div>
        <h2 className="mt-6 text-center text-2xl font-extrabold text-white">
          {view === 'login' ? 'Acessar sua conta' : 'Criar uma nova conta'}
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-700">
          {view === 'login' ? (
            <>
              <LoginForm />
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-700"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-gray-800 text-gray-400">
                      Ou
                    </span>
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <button
                    onClick={() => setView('register')}
                    className="text-sm text-red-400 hover:text-red-300 font-medium"
                  >
                    Não tem uma conta? Cadastre-se
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <RegisterForm />
              <div className="mt-6 text-center">
                <button
                  onClick={() => setView('login')}
                  className="text-sm text-red-400 hover:text-red-300 font-medium"
                >
                  Já tem uma conta? Faça login
                </button>
              </div>
            </>
          )}
        </div>
        
        <div className="mt-6 text-center text-sm">
          <span className="text-gray-400">
            Ao continuar, você concorda com nossos{' '}
            <a href="#" className="text-red-400 hover:text-red-300">
              Termos de Serviço
            </a>{' '}
            e{' '}
            <a href="#" className="text-red-400 hover:text-red-300">
              Política de Privacidade
            </a>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Auth;
