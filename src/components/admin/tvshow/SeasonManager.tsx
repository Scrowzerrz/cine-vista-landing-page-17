
import React from 'react';
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useSeasonEpisodeManager, Season } from '@/hooks/useSeasonEpisodeManager';
import EpisodeManager from './EpisodeManager';

interface SeasonManagerProps {
  onSeasonsChange: (seasons: Season[]) => void;
}

const SeasonManager: React.FC<SeasonManagerProps> = ({ onSeasonsChange }) => {
  const {
    seasons,
    createSeason,
    updateSeasonEpisodeCount,
    updateEpisode,
    removeSeason,
    getTotalEpisodes
  } = useSeasonEpisodeManager();

  const [openSeasons, setOpenSeasons] = React.useState<Record<string, boolean>>({});

  React.useEffect(() => {
    onSeasonsChange(seasons);
  }, [seasons, onSeasonsChange]);

  const handleAddSeason = () => {
    const seasonNumber = seasons.length + 1;
    const currentYear = new Date().getFullYear().toString();
    const seasonId = createSeason(seasonNumber, currentYear);
    setOpenSeasons(prev => ({ ...prev, [seasonId]: true }));
  };

  const handleSeasonEpisodeCountChange = (seasonId: string, count: number) => {
    updateSeasonEpisodeCount(seasonId, count);
  };

  const toggleSeason = (seasonId: string) => {
    setOpenSeasons(prev => ({ ...prev, [seasonId]: !prev[seasonId] }));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-white text-lg font-semibold">Gerenciar Temporadas</Label>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-400">
            Total: {seasons.length} temporadas, {getTotalEpisodes()} episódios
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddSeason}
            className="text-gray-300 border-gray-600 hover:bg-gray-700"
          >
            <Plus className="w-4 h-4 mr-1" />
            Adicionar Temporada
          </Button>
        </div>
      </div>

      {seasons.length === 0 && (
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="pt-6">
            <p className="text-center text-gray-400">
              Nenhuma temporada adicionada ainda. Clique em "Adicionar Temporada" para começar.
            </p>
          </CardContent>
        </Card>
      )}

      {seasons.map((season) => (
        <Card key={season.id} className="bg-gray-800 border-gray-700">
          <Collapsible open={openSeasons[season.id]} onOpenChange={() => toggleSeason(season.id)}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-white flex items-center gap-2">
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className="p-0 h-auto">
                      {openSeasons[season.id] ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </Button>
                  </CollapsibleTrigger>
                  Temporada {season.seasonNumber}
                  <span className="text-sm text-gray-400">
                    ({season.episodeCount} episódios)
                  </span>
                </CardTitle>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeSeason(season.id)}
                  className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>

            <CollapsibleContent>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white">Ano da Temporada</Label>
                    <Input
                      type="number"
                      value={season.year}
                      onChange={(e) => {
                        // Update season year logic here
                      }}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-white">Número de Episódios</Label>
                    <Input
                      type="number"
                      min="1"
                      value={season.episodeCount}
                      onChange={(e) => handleSeasonEpisodeCountChange(season.id, parseInt(e.target.value) || 0)}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                </div>

                {season.episodeCount > 0 && (
                  <EpisodeManager
                    season={season}
                    onEpisodeUpdate={(episodeId, episodeData) => 
                      updateEpisode(season.id, episodeId, episodeData)
                    }
                  />
                )}
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>
      ))}
    </div>
  );
};

export default SeasonManager;
