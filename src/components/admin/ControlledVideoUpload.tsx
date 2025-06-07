// src/components/admin/ControlledVideoUpload.tsx
import React, { useState, useCallback, useEffect } from 'react';
import { Upload, X, Video, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDropzone } from 'react-dropzone';
import { toast } from '@/hooks/use-toast';

interface ControlledVideoUploadProps {
  value?: File | string | null; // Pode ser um File, uma URL de string, ou null
  onChange: (file: File | null) => void; // Notifica sobre novo arquivo ou remoção
  className?: string;
}

const ControlledVideoUpload: React.FC<ControlledVideoUploadProps> = ({ value, onChange, className }) => {
  const [fileName, setFileName] = useState<string | null>(null);
  const [isUrl, setIsUrl] = useState<boolean>(false);
  const [fileSize, setFileSize] = useState<string | null>(null);

  useEffect(() => {
    if (typeof value === 'string' && value) {
      setFileName(value);
      setIsUrl(true);
      setFileSize(null); // Não temos tamanho para URLs
    } else if (value instanceof File) {
      setFileName(value.name);
      setFileSize((value.size / 1024 / 1024).toFixed(2) + ' MB');
      setIsUrl(false);
    } else {
      setFileName(null);
      setIsUrl(false);
      setFileSize(null);
    }
  }, [value]);

  const onDrop = useCallback((acceptedFiles: File[], fileRejections: any[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      // Validação de tipo de arquivo já feita pelo 'accept' do useDropzone
      onChange(file);
    } else if (fileRejections && fileRejections.length > 0) {
      // Arquivo rejeitado devido ao tipo ou tamanho (se configurado)
      toast({
        title: 'Arquivo Inválido',
        description: fileRejections[0].errors[0].message || 'Por favor, selecione um arquivo de vídeo válido.',
        variant: 'destructive',
      });
      onChange(null);
    }
  }, [onChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/mp4': ['.mp4'],
      'video/quicktime': ['.mov'],
      'video/x-msvideo': ['.avi'],
      'video/x-matroska': ['.mkv'],
      'video/webm': ['.webm'],
      // Adicionar outros tipos MIME e extensões conforme necessário
      // 'video/*': [] // Para aceitar qualquer vídeo, mas pode ser menos seguro
    },
    multiple: false,
    // Adicionar maxSize se necessário, ex: maxSize: 1024 * 1024 * 100, // 100MB
    // onDropRejected: (rejections) => { // Para lidar com rejeições de tamanho
    //   if (rejections && rejections[0] && rejections[0].errors[0].code === 'file-too-large') {
    //     toast({ title: 'Arquivo Muito Grande', description: `O arquivo excede o limite de tamanho.`, variant: 'destructive' });
    //   }
    // }
  });

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
  };

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors cursor-pointer
        ${isDragActive ? 'border-red-500 bg-red-50 dark:bg-red-950/20' : 'border-gray-300 dark:border-gray-700 hover:border-gray-500'}
        ${fileName ? 'border-solid' : ''}
        ${className}`}
    >
      <input {...getInputProps()} />
      {fileName ? (
        <div className="relative group flex flex-col items-center justify-center space-y-1">
          {isUrl ? <FileText className="w-10 h-10 text-blue-500 mb-1" /> : <Video className="w-10 h-10 text-green-500 mb-1" />}
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 break-all px-2">{fileName}</span>
          {fileSize && !isUrl && (
             <p className="text-xs text-gray-500 dark:text-gray-400">{fileSize}</p>
          )}
          <Button
            variant="destructive"
            size="icon"
            onClick={handleRemove}
            className="absolute top-0 right-0 w-6 h-6 opacity-0 group-hover:opacity-100"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        <div className="space-y-1 py-4 flex flex-col items-center justify-center">
          <Upload className="mx-auto w-10 h-10 text-gray-400" />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Arraste um vídeo ou <span className="text-red-500 dark:text-red-400 font-medium">clique para selecionar</span>
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500">MP4, MOV, AVI, MKV, WEBM</p>
        </div>
      )}
    </div>
  );
};

export default ControlledVideoUpload;
