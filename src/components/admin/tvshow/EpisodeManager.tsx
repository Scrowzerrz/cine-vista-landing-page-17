
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, FileVideo } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Season, Episode } from '@/hooks/useSeasonEpisodeManager';

interface EpisodeManagerProps {
  season: Season;
  onEpisodeUpdate: (episodeId: string, episodeData: Partial<Episode>) => void;
}

const EpisodeManager: React.FC<EpisodeManagerProps> = ({ season, onEpisodeUpdate }) => {
  const [openEpisodes, setOpenEpisodes] = useState<Record<string, boolean>>({});

  const toggleEpisode = (episodeId: string) => {
    setOpenEpisodes(prev => ({ ...prev, [episodeId]: !prev[episodeId] }));
  };

  const handleEpisodeChange = (episodeId: string, field: keyof Episode, value: string) => {
    onEpisodeUpdate(episodeId, { [field]: value });
  };

  return (
    <div className="space-y-3">
      <Label className="text-white font-medium">Episódios da Temporada {season.seasonNumber}</Label>
      
      {season.episodes.map((episode) => (
        <Card key={episode.id} className="bg-gray-700 border-gray-600">
          <Collapsible open={openEpisodes[episode.id]} onOpenChange={() => toggleEpisode(episode.id)}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-white flex items-center gap-2 text-sm">
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className="p-0 h-auto">
                      {openEpisodes[episode.id] ? (
                        <ChevronUp className="w-3 h-3" />
                      ) : (
                        <ChevronDown className="w-3 h-3" />
                      )}
                    </Button>
                  </CollapsibleTrigger>
                  <FileVideo className="w-4 h-4" />
                  Episódio {episode.episodeNumber}
                  {episode.title && <span className="text-gray-300">- {episode.title}</span>}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-1 rounded ${
                    episode.title && episode.playerUrl ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300'
                  }`}>
                    {episode.title && episode.playerUrl ? 'Completo' : 'Incompleto'}
                  </span>
                </div>
              </div>
            </CardHeader>

            <CollapsibleContent>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label className="text-white text-xs">Título do Episódio</Label>
                    <Input
                      value={episode.title}
                      onChange={(e) => handleEpisodeChange(episode.id, 'title', e.target.value)}
                      placeholder={`Episódio ${episode.episodeNumber}`}
                      className="bg-gray-600 border-gray-500 text-white text-sm"
                    />
                  </div>
                  <div>
                    <Label className="text-white text-xs">Duração</Label>
                    <Input
                      value={episode.runtime}
                      onChange={(e) => handleEpisodeChange(episode.id, 'runtime', e.target.value)}
                      placeholder="ex: 45 min"
                      className="bg-gray-600 border-gray-500 text-white text-sm"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-white text-xs">Sinopse do Episódio</Label>
                  <Textarea
                    value={episode.overview}
                    onChange={(e) => handleEpisodeChange(episode.id, 'overview', e.target.value)}
                    placeholder="Descrição do episódio..."
                    rows={2}
                    className="bg-gray-600 border-gray-500 text-white text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label className="text-white text-xs">URL do Poster do Episódio</Label>
                    <Input
                      value={episode.poster}
                      onChange={(e) => handleEpisodeChange(episode.id, 'poster', e.target.value)}
                      placeholder="https://..."
                      type="url"
                      className="bg-gray-600 border-gray-500 text-white text-sm"
                    />
                  </div>
                  <div>
                    <Label className="text-white text-xs">URL do Player do Episódio *</Label>
                    <Input
                      value={episode.playerUrl}
                      onChange={(e) => handleEpisodeChange(episode.id, 'playerUrl', e.target.value)}
                      placeholder="https://..."
                      type="url"
                      className="bg-gray-600 border-gray-500 text-white text-sm"
                    />
                  </div>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>
      ))}
    </div>
  );
};

export default EpisodeManager;
