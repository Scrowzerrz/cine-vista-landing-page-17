
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Film, Tv } from 'lucide-react';
import MovieEditor from './MovieEditor';
import TVShowEditor from './TVShowEditor';

const ContentEditor: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Editor de Conteúdo</h2>
        <p className="text-gray-400">Edite filmes e séries existentes</p>
      </div>

      <Tabs defaultValue="movies" className="w-full">
        <TabsList className="bg-gray-900 border-gray-700">
          <TabsTrigger 
            value="movies" 
            className="data-[state=active]:bg-red-600 data-[state=active]:text-white text-gray-300"
          >
            <Film className="w-4 h-4 mr-2" />
            Filmes
          </TabsTrigger>
          <TabsTrigger 
            value="tvshows"
            className="data-[state=active]:bg-red-600 data-[state=active]:text-white text-gray-300"
          >
            <Tv className="w-4 h-4 mr-2" />
            Séries
          </TabsTrigger>
        </TabsList>

        <TabsContent value="movies" className="space-y-6">
          <MovieEditor />
        </TabsContent>

        <TabsContent value="tvshows" className="space-y-6">
          <TVShowEditor />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContentEditor;
