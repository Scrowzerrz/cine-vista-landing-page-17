
import React from 'react';
import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface TVShowPersonnelFieldsProps {
  actors: string[];
  directors: string[];
  producers: string[];
  categories: string[];
  setActors: (actors: string[]) => void;
  setDirectors: (directors: string[]) => void;
  setProducers: (producers: string[]) => void;
  setCategories: (categories: string[]) => void;
}

const TVShowPersonnelFields: React.FC<TVShowPersonnelFieldsProps> = ({
  actors,
  directors,
  producers,
  categories,
  setActors,
  setDirectors,
  setProducers,
  setCategories
}) => {
  const addField = (current: string[], setter: (value: string[]) => void) => {
    setter([...current, '']);
  };

  const removeField = (index: number, current: string[], setter: (value: string[]) => void) => {
    setter(current.filter((_, i) => i !== index));
  };

  const updateField = (index: number, value: string, current: string[], setter: (value: string[]) => void) => {
    const updated = [...current];
    updated[index] = value;
    setter(updated);
  };

  const renderFieldGroup = (
    title: string,
    placeholder: string,
    fields: string[],
    setter: (value: string[]) => void
  ) => (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-white">{title}</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => addField(fields, setter)}
          className="text-gray-300 border-gray-600 hover:bg-gray-700"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>
      {fields.map((field, index) => (
        <div key={index} className="flex gap-2">
          <Input
            value={field}
            onChange={(e) => updateField(index, e.target.value, fields, setter)}
            placeholder={placeholder}
            className="bg-gray-700 border-gray-600 text-white"
          />
          {fields.length > 1 && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => removeField(index, fields, setter)}
              className="text-red-400 border-gray-600 hover:bg-red-900/20"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-white">Elenco e Equipe</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {renderFieldGroup('Atores', 'Nome do ator', actors, setActors)}
        {renderFieldGroup('Diretores', 'Nome do diretor', directors, setDirectors)}
        {renderFieldGroup('Produtores', 'Nome do produtor', producers, setProducers)}
        {renderFieldGroup('Categorias', 'Nome da categoria', categories, setCategories)}
      </div>
    </div>
  );
};

export default TVShowPersonnelFields;
