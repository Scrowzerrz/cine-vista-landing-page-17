
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

  console.log('=== ADMIN PAGE RENDER ===');
  console.log('Auth state:', { 
    hasUser: !!user, 
    userEmail: user?.email,
    userId: user?.id,
    authLoading 
  });
  console.log('Role state:', { 
    roleLoading, 
    isAdminResult: isAdmin(),
    roleError 
  });

  // Aguardar autenticação ser carregada
  if (authLoading) {
    console.log('Admin: Auth loading...');
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

  // Se não está autenticado
  if (!user) {
    console.log('Admin: No user found, redirecting to auth');
    return <Navigate to="/auth" replace />;
  }

  // Aguardar verificação de roles
  if (roleLoading) {
    console.log('Admin: Role verification loading...');
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

  // Verificar se é admin
  const userIsAdmin = isAdmin();
  console.log('Admin: Final admin check result:', userIsAdmin);

  // Se não é admin, redirecionar
  if (!userIsAdmin) {
    console.log('Admin: User is not admin, redirecting to home');
    return <Navigate to="/" replace />;
  }

  console.log('Admin: Rendering admin panel for user:', user.email);

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
