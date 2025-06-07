// src/components/admin/ControlledImageUpload.tsx
import React, { useState, useCallback, useEffect } from 'react';
import { Upload, X, FileImage } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDropzone } from 'react-dropzone';
import { toast } from '@/hooks/use-toast';

interface ControlledImageUploadProps {
  value?: File | string | null; // Pode ser um File, uma URL de string, ou null
  onChange: (file: File | null) => void; // Notifica sobre novo arquivo ou remoção
  className?: string;
}

const ControlledImageUpload: React.FC<ControlledImageUploadProps> = ({ value, onChange, className }) => {
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (typeof value === 'string') {
      setPreview(value); // Se o valor é string (URL), usa como preview
    } else if (value instanceof File) {
      const objectUrl = URL.createObjectURL(value);
      setPreview(objectUrl); // Se é File, gera preview local
      return () => URL.revokeObjectURL(objectUrl); // Limpa o object URL ao desmontar ou quando value mudar
    } else {
      setPreview(null);
    }
  }, [value]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles[0]) {
      const file = acceptedFiles[0];
      if (file.type.startsWith('image/')) {
        onChange(file);
      } else {
        toast({
          title: 'Erro de Tipo',
          description: 'Por favor, selecione apenas arquivos de imagem.',
          variant: 'destructive',
        });
        onChange(null); // Limpa se o tipo for inválido
      }
    } else {
      // Se nenhum arquivo for aceito (ex: tipo errado não listado no 'accept')
      // ou se o usuário cancelar o diálogo de seleção.
      // Se 'value' já era um File, e o usuário tenta upar um inválido,
      // pode ser desejável limpar o 'value' anterior ou mantê-lo.
      // A lógica atual com onChange(null) em caso de erro de tipo já limpa.
      // Se o usuário simplesmente fecha o diálogo sem selecionar nada, não fazemos nada.
    }
  }, [onChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'] },
    multiple: false,
  });

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation(); // Impede que o dropzone seja ativado ao clicar no botão
    onChange(null);
    setPreview(null); // setPreview(null) já é tratado pelo useEffect ao 'value' mudar para null
  };

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors cursor-pointer
        ${isDragActive ? 'border-red-500 bg-red-50 dark:bg-red-950/20' : 'border-gray-300 dark:border-gray-700 hover:border-gray-500'}
        ${preview ? 'border-solid' : ''}
        ${className}`}
    >
      <input {...getInputProps()} />
      {preview ? (
        <div className="relative group aspect-video flex items-center justify-center">
          <img src={preview} alt="Preview" className="mx-auto max-h-40 object-contain rounded" />
          <Button
            variant="destructive"
            size="icon"
            onClick={handleRemove}
            className="absolute top-1 right-1 w-6 h-6 opacity-0 group-hover:opacity-100 hover:bg-red-700"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        <div className="space-y-1 py-4 flex flex-col items-center justify-center">
          <FileImage className="mx-auto w-10 h-10 text-gray-400" />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Arraste uma imagem ou <span className="text-red-500 dark:text-red-400 font-medium">clique para selecionar</span>
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500">PNG, JPG, GIF, WEBP (Max 10MB)</p>
        </div>
      )}
    </div>
  );
};

export default ControlledImageUpload;
