
import { useState, useCallback } from 'react';

export interface Episode {
  id: string;
  title: string;
  episodeNumber: number;
  overview: string;
  runtime: string;
  poster: string;
  playerUrl: string;
}

export interface Season {
  id: string;
  seasonNumber: number;
  year: string;
  episodeCount: number;
  episodes: Episode[];
}

export const useSeasonEpisodeManager = () => {
  const [seasons, setSeasons] = useState<Season[]>([]);

  const createSeason = useCallback((seasonNumber: number, year: string) => {
    const newSeason: Season = {
      id: `season-${Date.now()}-${seasonNumber}`,
      seasonNumber,
      year,
      episodeCount: 0,
      episodes: []
    };
    setSeasons(prev => [...prev, newSeason].sort((a, b) => a.seasonNumber - b.seasonNumber));
    return newSeason.id;
  }, []);

  const updateSeasonEpisodeCount = useCallback((seasonId: string, episodeCount: number) => {
    setSeasons(prev => prev.map(season => {
      if (season.id === seasonId) {
        const updatedSeason = { ...season, episodeCount };
        // Adjust episodes array to match episode count
        if (episodeCount > season.episodes.length) {
          // Add new episodes
          const newEpisodes = Array.from(
            { length: episodeCount - season.episodes.length },
            (_, index) => ({
              id: `episode-${Date.now()}-${season.episodes.length + index + 1}`,
              title: '',
              episodeNumber: season.episodes.length + index + 1,
              overview: '',
              runtime: '',
              poster: '',
              playerUrl: ''
            })
          );
          updatedSeason.episodes = [...season.episodes, ...newEpisodes];
        } else if (episodeCount < season.episodes.length) {
          // Remove excess episodes
          updatedSeason.episodes = season.episodes.slice(0, episodeCount);
        }
        return updatedSeason;
      }
      return season;
    }));
  }, []);

  const updateEpisode = useCallback((seasonId: string, episodeId: string, episodeData: Partial<Episode>) => {
    setSeasons(prev => prev.map(season => {
      if (season.id === seasonId) {
        return {
          ...season,
          episodes: season.episodes.map(episode =>
            episode.id === episodeId ? { ...episode, ...episodeData } : episode
          )
        };
      }
      return season;
    }));
  }, []);

  const removeSeason = useCallback((seasonId: string) => {
    setSeasons(prev => prev.filter(season => season.id !== seasonId));
  }, []);

  const getTotalEpisodes = useCallback(() => {
    return seasons.reduce((total, season) => total + season.episodeCount, 0);
  }, [seasons]);

  return {
    seasons,
    createSeason,
    updateSeasonEpisodeCount,
    updateEpisode,
    removeSeason,
    getTotalEpisodes,
    setSeasons
  };
};
