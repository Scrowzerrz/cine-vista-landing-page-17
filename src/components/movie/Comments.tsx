
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { toast } from '@/hooks/use-toast';

interface Comment {
  id: string;
  text: string;
  user: {
    name: string;
    avatar?: string;
  };
  date: string;
}

const Comments: React.FC = () => {
  const { user } = useAuth();
  const [commentText, setCommentText] = useState('');

  const submitComment = () => {
    if (!user) {
      toast({
        title: "Login necessário",
        description: "Você precisa estar logado para comentar",
        variant: "destructive"
      });
      return;
    }
    
    if (commentText.trim() === '') {
      toast({
        title: "Comentário vazio",
        description: "Por favor, escreva algo antes de enviar",
        variant: "destructive"
      });
      return;
    }
    
    // Em produção, enviaríamos o comentário para o backend
    toast({
      title: "Comentário enviado",
      description: "Seu comentário foi enviado com sucesso!"
    });
    
    setCommentText('');
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg border border-gray-700">
      <h2 className="flex items-center text-xl font-bold mb-4">
        <MessageSquare className="mr-2 h-5 w-5" />
        DEIXE SEU COMENTÁRIO
      </h2>
      
      <div className="mb-4 text-sm text-gray-400">
        <p>A partir de hoje (12 de agosto) os comentários ficarão ocultos, para visualizá-los ou comentar clique no botão abaixo. Também tivemos que resetar os comentários antigos para o bem do site.</p>
      </div>
      
      <div className="mb-6">
        <Button 
          className="w-full py-6 bg-gray-700 hover:bg-gray-600 text-white/90"
          onClick={() => {}}
        >
          Faça um Comentário
        </Button>
      </div>
      
      {user && (
        <div className="mt-6 space-y-4">
          <textarea 
            className="w-full h-24 bg-gray-700/70 border border-gray-600 rounded-lg p-3 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="Escreva seu comentário aqui..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
          <Button 
            className="ml-auto bg-red-600 hover:bg-red-700" 
            onClick={submitComment}
          >
            Enviar Comentário
          </Button>
        </div>
      )}
    </div>
  );
};

export default Comments;
