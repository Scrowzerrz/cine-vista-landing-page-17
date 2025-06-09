
import React, { useState } from 'react';
import { Play, Link, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface MoviePlayerManagerProps {
  playerUrl: string;
  onPlayerUrlChange: (url: string) => void;
}

const MoviePlayerManager: React.FC<MoviePlayerManagerProps> = ({
  playerUrl,
  onPlayerUrlChange
}) => {
  const [playerType, setPlayerType] = useState<'url' | 'embed' | 'upload'>('url');
  const [embedCode, setEmbedCode] = useState('');

  const handlePlayerTypeChange = (type: string) => {
    setPlayerType(type as 'url' | 'embed' | 'upload');
    if (type === 'url') {
      onPlayerUrlChange(playerUrl);
    } else if (type === 'embed') {
      // Extract URL from embed code if possible
      const urlMatch = embedCode.match(/src="([^"]+)"/);
      if (urlMatch) {
        onPlayerUrlChange(urlMatch[1]);
      }
    }
  };

  const handleEmbedCodeChange = (code: string) => {
    setEmbedCode(code);
    // Try to extract URL from embed code
    const urlMatch = code.match(/src="([^"]+)"/);
    if (urlMatch) {
      onPlayerUrlChange(urlMatch[1]);
    }
  };

  const testPlayer = () => {
    if (playerUrl) {
      window.open(playerUrl, '_blank');
    }
  };

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Play className="w-5 h-5" />
          Configuração do Player
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={playerType} onValueChange={handlePlayerTypeChange}>
          <TabsList className="grid w-full grid-cols-3 bg-gray-700">
            <TabsTrigger value="url" className="data-[state=active]:bg-red-600">
              URL Direta
            </TabsTrigger>
            <TabsTrigger value="embed" className="data-[state=active]:bg-red-600">
              Código Embed
            </TabsTrigger>
            <TabsTrigger value="upload" className="data-[state=active]:bg-red-600">
              Upload Arquivo
            </TabsTrigger>
          </TabsList>

          <TabsContent value="url" className="space-y-4">
            <div>
              <Label className="text-white">URL do Player/Streaming *</Label>
              <div className="flex gap-2">
                <Input
                  value={playerUrl}
                  onChange={(e) => onPlayerUrlChange(e.target.value)}
                  placeholder="https://exemplo.com/player/filme123"
                  type="url"
                  className="bg-gray-700 border-gray-600 text-white"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={testPlayer}
                  disabled={!playerUrl}
                  className="text-gray-300 border-gray-600 hover:bg-gray-700"
                >
                  <Link className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Insira a URL completa do player ou serviço de streaming
              </p>
            </div>
          </TabsContent>

          <TabsContent value="embed" className="space-y-4">
            <div>
              <Label className="text-white">Código Embed HTML</Label>
              <textarea
                value={embedCode}
                onChange={(e) => handleEmbedCodeChange(e.target.value)}
                placeholder='<iframe src="https://exemplo.com/embed/filme123" width="100%" height="400"></iframe>'
                rows={4}
                className="w-full bg-gray-700 border-gray-600 text-white rounded-md p-2 text-sm"
              />
              <p className="text-xs text-gray-400 mt-1">
                Cole o código embed fornecido pelo serviço de streaming
              </p>
            </div>
          </TabsContent>

          <TabsContent value="upload" className="space-y-4">
            <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-white mb-2">Upload de Arquivo de Vídeo</p>
              <p className="text-sm text-gray-400 mb-4">
                Arraste e solte ou clique para selecionar
              </p>
              <Button variant="outline" className="text-gray-300 border-gray-600">
                Selecionar Arquivo
              </Button>
              <p className="text-xs text-gray-500 mt-2">
                Suporta: MP4, MKV, AVI (máx. 2GB)
              </p>
            </div>
          </TabsContent>
        </Tabs>

        {playerUrl && (
          <div className="mt-4 p-3 bg-green-900/20 border border-green-700 rounded-lg">
            <p className="text-green-300 text-sm flex items-center gap-2">
              <Play className="w-4 h-4" />
              Player configurado: {playerUrl.substring(0, 50)}...
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MoviePlayerManager;
