
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, X } from 'lucide-react';

interface MoviePersonnelFieldsProps {
  actors: string[];
  setActors: React.Dispatch<React.SetStateAction<string[]>>;
  directors: string[];
  setDirectors: React.Dispatch<React.SetStateAction<string[]>>;
  producers: string[];
  setProducers: React.Dispatch<React.SetStateAction<string[]>>;
  categories: string[];
  setCategories: React.Dispatch<React.SetStateAction<string[]>>;
}

const MoviePersonnelFields: React.FC<MoviePersonnelFieldsProps> = ({
  actors,
  setActors,
  directors,
  setDirectors,
  producers,
  setProducers,
  categories,
  setCategories
}) => {
  const addField = (field: 'actors' | 'directors' | 'producers' | 'categories') => {
    switch (field) {
      case 'actors':
        setActors([...actors, '']);
        break;
      case 'directors':
        setDirectors([...directors, '']);
        break;
      case 'producers':
        setProducers([...producers, '']);
        break;
      case 'categories':
        setCategories([...categories, '']);
        break;
    }
  };

  const removeField = (field: 'actors' | 'directors' | 'producers' | 'categories', index: number) => {
    switch (field) {
      case 'actors':
        setActors(actors.filter((_, i) => i !== index));
        break;
      case 'directors':
        setDirectors(directors.filter((_, i) => i !== index));
        break;
      case 'producers':
        setProducers(producers.filter((_, i) => i !== index));
        break;
      case 'categories':
        setCategories(categories.filter((_, i) => i !== index));
        break;
    }
  };

  const updateField = (field: 'actors' | 'directors' | 'producers' | 'categories', index: number, value: string) => {
    switch (field) {
      case 'actors':
        const newActors = [...actors];
        newActors[index] = value;
        setActors(newActors);
        break;
      case 'directors':
        const newDirectors = [...directors];
        newDirectors[index] = value;
        setDirectors(newDirectors);
        break;
      case 'producers':
        const newProducers = [...producers];
        newProducers[index] = value;
        setProducers(newProducers);
        break;
      case 'categories':
        const newCategories = [...categories];
        newCategories[index] = value;
        setCategories(newCategories);
        break;
    }
  };

  const renderFieldArray = (
    title: string,
    field: 'actors' | 'directors' | 'producers' | 'categories',
    values: string[]
  ) => (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-white">{title}</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => addField(field)}
          className="text-gray-300 border-gray-600 hover:bg-gray-700"
        >
          <Plus className="w-4 h-4 mr-1" />
          Adicionar
        </Button>
      </div>
      {values.map((value, index) => (
        <div key={index} className="flex gap-2">
          <Input
            value={value}
            onChange={(e) => updateField(field, index, e.target.value)}
            placeholder={`Nome ${title.toLowerCase().slice(0, -1)}`}
            className="bg-gray-800 border-gray-600 text-white"
          />
          {values.length > 1 && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removeField(field, index)}
              className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {renderFieldArray('Atores', 'actors', actors)}
        {renderFieldArray('Diretores', 'directors', directors)}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {renderFieldArray('Produtores', 'producers', producers)}
        {renderFieldArray('Categorias', 'categories', categories)}
      </div>
    </>
  );
};

export default MoviePersonnelFields;
