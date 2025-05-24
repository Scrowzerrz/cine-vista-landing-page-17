
import React from 'react';
import { Navigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import UploadsPanel from '@/components/admin/UploadsPanel';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';
import { motion } from 'framer-motion';

const Admin = () => {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: roleLoading, error: roleError } = useUserRole();

  console.log('Admin page state:', { 
    hasUser: !!user, 
    userEmail: user?.email,
    authLoading, 
    roleLoading, 
    isAdminResult: isAdmin(),
    roleError 
  });

  // Se está carregando autenticação, mostrar loading
  if (authLoading) {
    console.log('Admin: showing auth loading');
    return (
      <div className="bg-gradient-to-b from-gray-900 to-gray-950 min-h-screen text-white flex items-center justify-center">
        <Navbar />
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full"
          />
          <span className="text-gray-400">Carregando autenticação...</span>
        </motion.div>
      </div>
    );
  }

  // Se não está autenticado, redirecionar para login
  if (!user) {
    console.log('Admin: no user, redirecting to auth');
    return <Navigate to="/auth" replace />;
  }

  // Se ainda está verificando roles, mostrar loading específico
  if (roleLoading) {
    console.log('Admin: showing role loading');
    return (
      <div className="bg-gradient-to-b from-gray-900 to-gray-950 min-h-screen text-white">
        <Navbar />
        <main className="pt-20 pb-12 flex items-center justify-center min-h-screen">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center gap-4"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full"
            />
            <span className="text-gray-400">Verificando permissões para {user.email}...</span>
          </motion.div>
        </main>
        <Footer />
      </div>
    );
  }

  // Se houve erro na verificação de roles, mostrar erro mas permitir acesso se for admin
  if (roleError) {
    console.warn('Admin: role verification error:', roleError);
  }

  // Verificar se é admin
  const userIsAdmin = isAdmin();
  console.log('Admin: final admin check:', userIsAdmin);

  // Se não é admin, redirecionar para home
  if (!userIsAdmin) {
    console.log('Admin: user is not admin, redirecting to home');
    return <Navigate to="/" replace />;
  }

  console.log('Admin: rendering admin panel');

  return (
    <div className="bg-gradient-to-b from-gray-900 to-gray-950 min-h-screen text-white">
      <Navbar />
      
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <UploadsPanel />
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Admin;
