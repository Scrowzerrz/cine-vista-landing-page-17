
import React, { useState } from 'react';
import { Upload, X, FileImage } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { uploadFile } from '@/services/uploadService';
import { toast } from '@/hooks/use-toast';

interface FileUploadProps {
  onUploadSuccess: () => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onUploadSuccess }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadType, setUploadType] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const uploadTypes = [
    { value: 'movie_poster', label: 'Poster de Filme' },
    { value: 'movie_backdrop', label: 'Backdrop de Filme' },
    { value: 'tvshow_poster', label: 'Poster de Série' },
    { value: 'tvshow_backdrop', label: 'Backdrop de Série' },
    { value: 'episode_poster', label: 'Poster de Episódio' }
  ];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (file: File) => {
    if (file.type.startsWith('image/')) {
      setSelectedFile(file);
    } else {
      toast({
        title: 'Tipo de Arquivo Inválido',
        description: 'Por favor, selecione apenas arquivos de imagem (PNG, JPG, JPEG, etc.).',
        variant: 'destructive'
      });
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !uploadType) {
      toast({
        title: 'Informação Incompleta',
        description: 'Por favor, selecione um arquivo e especifique o tipo de upload.',
        variant: 'destructive'
      });
      return;
    }

    setUploading(true);
    try {
      await uploadFile(selectedFile, uploadType as any);
      toast({
        title: 'Sucesso',
        description: 'Arquivo enviado com sucesso!'
      });
      setSelectedFile(null);
      setUploadType('');
      onUploadSuccess();
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: 'Erro no Upload do Arquivo',
        description: `Falha ao enviar o arquivo: ${(error instanceof Error) ? error.message : 'Erro desconhecido'}.`,
        variant: 'destructive'
      });
    } finally {
      setUploading(false);
    }
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* File Drop Zone */}
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive
              ? 'border-red-500 bg-red-50 dark:bg-red-950/20'
              : 'border-gray-300 dark:border-gray-600'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleFileInputChange}
            className="hidden"
            id="file-upload"
          />
          
          {selectedFile ? (
            <div className="space-y-4">
              <div className="flex items-center justify-center space-x-2">
                <FileImage className="w-8 h-8 text-green-500" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {selectedFile.name}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={removeSelectedFile}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-sm text-gray-500">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <Upload className="mx-auto w-12 h-12 text-gray-400" />
              <div>
                <label htmlFor="file-upload" className="cursor-pointer">
                  <span className="text-red-500 hover:text-red-600 font-medium">
                    {dragActive ? "Solte o arquivo aqui!" : "Clique para enviar"}
                  </span>
                  {!dragActive && <span className="text-gray-500"> ou arraste e solte</span>}
                </label>
                <p className="text-sm text-gray-500 mt-2">
                  PNG, JPG, JPEG até 10MB
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Upload Settings */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tipo de Upload
            </label>
            <Select value={uploadType} onValueChange={setUploadType}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                {uploadTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={handleUpload}
            disabled={!selectedFile || !uploadType || uploading}
            className="w-full bg-red-600 hover:bg-red-700"
          >
            {uploading ? 'Enviando...' : 'Enviar Arquivo'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
