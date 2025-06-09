import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FileUpload from './FileUpload';
import { toast } from '@/hooks/use-toast';
import * as uploadService from '@/services/uploadService'; // So we can mock uploadFile

// Mocking external dependencies
jest.mock('@/hooks/use-toast', () => ({
  toast: jest.fn(),
}));

jest.mock('@/services/uploadService', () => ({
  uploadFile: jest.fn(),
}));

const mockOnUploadSuccess = jest.fn();

const renderComponent = () => render(<FileUpload onUploadSuccess={mockOnUploadSuccess} />);

describe('FileUpload Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset file input if necessary, though RTL unmounts and remounts.
  });

  describe('Initial Rendering', () => {
    it('renders drop zone and upload type selector', () => {
      renderComponent();
      expect(screen.getByText(/clique para enviar/i)).toBeInTheDocument();
      expect(screen.getByText(/ou arraste e solte/i)).toBeInTheDocument();
      expect(screen.getByRole('combobox', { name: '' })).toBeInTheDocument(); // SelectTrigger often doesn't have an explicit accessible name without a Label pointing to it via htmlFor
      expect(screen.getByText('Selecione o tipo')).toBeInTheDocument(); // Placeholder for Select
    });
  });

  describe('File Selection and Validation', () => {
    it('selects a valid image file and displays its name and size', async () => {
      renderComponent();
      const file = new File(['(⌐□_□)'], 'chucknorris.png', { type: 'image/png' });
      const fileInput = screen.getByLabelText(/clique para enviar/i).closest('div')?.querySelector('input[type="file"]') as HTMLInputElement; // More robust way to get hidden input

      expect(fileInput).toBeInTheDocument();

      await userEvent.upload(fileInput, file);

      expect(await screen.findByText('chucknorris.png')).toBeInTheDocument();
      // Size might vary slightly based on encoding, check for MB part
      expect(screen.getByText(/mb/i)).toBeInTheDocument();
      expect(toast).not.toHaveBeenCalled();
    });

    it('shows error toast for non-image file selection', async () => {
      renderComponent();
      const file = new File(['content'], 'document.pdf', { type: 'application/pdf' });
      const fileInput = screen.getByLabelText(/clique para enviar/i).closest('div')?.querySelector('input[type="file"]') as HTMLInputElement;

      await userEvent.upload(fileInput, file);

      expect(toast).toHaveBeenCalledWith(expect.objectContaining({
        title: 'Tipo de Arquivo Inválido',
        description: 'Por favor, selecione apenas arquivos de imagem (PNG, JPG, JPEG, etc.).',
        variant: 'destructive',
      }));
      expect(screen.queryByText('document.pdf')).not.toBeInTheDocument();
    });

    it('allows removing a selected file', async () => {
      renderComponent();
      const file = new File(['(⌐□_□)'], 'chucknorris.png', { type: 'image/png' });
      const fileInput = screen.getByLabelText(/clique para enviar/i).closest('div')?.querySelector('input[type="file"]') as HTMLInputElement;

      await userEvent.upload(fileInput, file);
      expect(await screen.findByText('chucknorris.png')).toBeInTheDocument();

      const removeButton = screen.getByRole('button', { name: /x/i }); // Assuming X is the accessible name or part of it
      await userEvent.click(removeButton);

      expect(screen.queryByText('chucknorris.png')).not.toBeInTheDocument();
      expect(screen.getByText(/clique para enviar/i)).toBeInTheDocument(); // Back to initial state
    });

    // Drag and drop testing with RTL can be limited. We'll test the handlers if possible.
    // For true e2e drag/drop, a tool like Cypress or Playwright is better.
    // Here, we'll test the state change for dragActive and the drop handler logic.
    it('activates drag state on dragenter/dragover', () => {
      renderComponent();
      const dropZone = screen.getByText(/clique para enviar/i).closest('div[class*="border-dashed"]') as HTMLElement;

      fireEvent.dragEnter(dropZone, { dataTransfer: { files: [] } }); // Provide minimal DataTransfer object
      expect(dropZone.className).toContain('border-red-500'); // Assuming this class indicates active drag
      expect(screen.getByText(/solte o arquivo aqui!/i)).toBeInTheDocument();

      fireEvent.dragLeave(dropZone);
      expect(dropZone.className).not.toContain('border-red-500');
      expect(screen.getByText(/clique para enviar/i)).toBeInTheDocument();
    });

    it('handles valid file drop correctly', async () => {
        renderComponent();
        const dropZone = screen.getByText(/clique para enviar/i).closest('div[class*="border-dashed"]') as HTMLElement;
        const file = new File(['(⌐□_□)'], 'dropped.png', { type: 'image/png' });

        fireEvent.drop(dropZone, { dataTransfer: { files: [file] } });

        expect(await screen.findByText('dropped.png')).toBeInTheDocument();
        expect(toast).not.toHaveBeenCalled();
    });

    it('handles invalid file drop correctly', async () => {
        renderComponent();
        const dropZone = screen.getByText(/clique para enviar/i).closest('div[class*="border-dashed"]') as HTMLElement;
        const file = new File(['text'], 'textdoc.txt', { type: 'text/plain' });

        fireEvent.drop(dropZone, { dataTransfer: { files: [file] } });

        expect(toast).toHaveBeenCalledWith(expect.objectContaining({
            title: 'Tipo de Arquivo Inválido',
        }));
        expect(screen.queryByText('textdoc.txt')).not.toBeInTheDocument();
    });
  });

  describe('Upload Type Selection', () => {
    it('updates uploadType state on selection', async () => {
      renderComponent();
      const selectTrigger = screen.getByRole('combobox');
      await userEvent.click(selectTrigger);

      // Assuming 'Poster de Filme' is one of the options
      const option = await screen.findByText('Poster de Filme');
      await userEvent.click(option);

      // The selected value should now be visible in the trigger
      expect(await screen.findByText('Poster de Filme')).toBeInTheDocument();
      // Direct state checking is not typical in RTL. We infer state from UI or component behavior.
      // We'll verify this state by checking what's passed to uploadFile service later.
    });
  });

  describe('handleUpload Logic', () => {
    it('successfully uploads a file and calls onUploadSuccess', async () => {
      (uploadService.uploadFile as jest.Mock).mockResolvedValueOnce({
        // Simulate a successful response if your service returns something specific
        // For example: { path: 'uploads/movie_poster/newfile.png' }
      });

      renderComponent();

      // 1. Select a file
      const file = new File(['(⌐□_□)'], 'uploadme.png', { type: 'image/png' });
      const fileInput = screen.getByLabelText(/clique para enviar/i).closest('div')?.querySelector('input[type="file"]') as HTMLInputElement;
      await userEvent.upload(fileInput, file);
      expect(await screen.findByText('uploadme.png')).toBeInTheDocument();

      // 2. Select an upload type
      const selectTrigger = screen.getByRole('combobox');
      await userEvent.click(selectTrigger);
      await userEvent.click(await screen.findByText('Poster de Filme')); // Select 'movie_poster'

      // 3. Click upload button
      const uploadButton = screen.getByRole('button', { name: /enviar arquivo/i });
      await userEvent.click(uploadButton);

      expect(uploadService.uploadFile).toHaveBeenCalledWith(file, 'movie_poster');
      await waitFor(() => {
        expect(toast).toHaveBeenCalledWith(expect.objectContaining({
          title: 'Sucesso',
          description: 'Arquivo enviado com sucesso!',
        }));
      });
      expect(mockOnUploadSuccess).toHaveBeenCalledTimes(1);

      // Check form reset
      expect(screen.queryByText('uploadme.png')).not.toBeInTheDocument();
      expect(screen.getByText('Selecione o tipo')).toBeInTheDocument(); // Placeholder back
    });

    it('shows error toast if uploadFile service fails', async () => {
      (uploadService.uploadFile as jest.Mock).mockRejectedValueOnce(new Error('Network Error'));

      renderComponent();
      const file = new File(['(⌐□_□)'], 'failupload.png', { type: 'image/png' });
      const fileInput = screen.getByLabelText(/clique para enviar/i).closest('div')?.querySelector('input[type="file"]') as HTMLInputElement;
      await userEvent.upload(fileInput, file);
      const selectTrigger = screen.getByRole('combobox');
      await userEvent.click(selectTrigger);
      await userEvent.click(await screen.findByText('Backdrop de Série'));

      const uploadButton = screen.getByRole('button', { name: /enviar arquivo/i });
      await userEvent.click(uploadButton);

      expect(uploadService.uploadFile).toHaveBeenCalled();
      await waitFor(() => {
        expect(toast).toHaveBeenCalledWith(expect.objectContaining({
          title: 'Erro no Upload do Arquivo',
          description: 'Falha ao enviar o arquivo: Network Error',
          variant: 'destructive',
        }));
      });
      expect(mockOnUploadSuccess).not.toHaveBeenCalled();
    });

    it('shows error toast if no file is selected', async () => {
      renderComponent();
      const selectTrigger = screen.getByRole('combobox');
      await userEvent.click(selectTrigger);
      await userEvent.click(await screen.findByText('Poster de Episódio')); // Select a type

      const uploadButton = screen.getByRole('button', { name: /enviar arquivo/i });
      await userEvent.click(uploadButton);

      expect(uploadService.uploadFile).not.toHaveBeenCalled();
      expect(toast).toHaveBeenCalledWith(expect.objectContaining({
        title: 'Informação Incompleta',
        description: 'Por favor, selecione um arquivo e especifique o tipo de upload.',
        variant: 'destructive',
      }));
    });

    it('shows error toast if no upload type is selected', async () => {
      renderComponent();
      const file = new File(['(⌐□_□)'], 'notype.png', { type: 'image/png' });
      const fileInput = screen.getByLabelText(/clique para enviar/i).closest('div')?.querySelector('input[type="file"]') as HTMLInputElement;
      await userEvent.upload(fileInput, file);

      const uploadButton = screen.getByRole('button', { name: /enviar arquivo/i });
      await userEvent.click(uploadButton);

      expect(uploadService.uploadFile).not.toHaveBeenCalled();
      expect(toast).toHaveBeenCalledWith(expect.objectContaining({
        title: 'Informação Incompleta',
        description: 'Por favor, selecione um arquivo e especifique o tipo de upload.',
        variant: 'destructive',
      }));
    });
  });

  describe('Drag and Drop UI Text Change', () => {
    it('shows "Solte o arquivo aqui!" when dragging over', () => {
      renderComponent();
      const dropZoneContainer = screen.getByText(/clique para enviar/i).parentElement?.parentElement as HTMLElement; // a bit fragile selector

      fireEvent.dragEnter(dropZoneContainer, { dataTransfer: { files: [] } });
      // The text "Solte o arquivo aqui!" is part of a specific span
      expect(screen.getByText("Solte o arquivo aqui!")).toBeInTheDocument();
      expect(screen.queryByText(/clique para enviar/i)).not.toBeInTheDocument(); // This part should be hidden
      expect(screen.queryByText(/ou arraste e solte/i)).not.toBeInTheDocument(); // This part should be hidden

      fireEvent.dragLeave(dropZoneContainer);
      expect(screen.getByText(/clique para enviar/i)).toBeInTheDocument();
      expect(screen.getByText(/ou arraste e solte/i)).toBeInTheDocument();
    });
  });
});
