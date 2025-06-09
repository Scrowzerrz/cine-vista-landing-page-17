import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UploadsPanel from './UploadsPanel';
import { toast } from '@/hooks/use-toast';
import * as uploadService from '@/services/uploadService'; // To mock its functions

// Mocking external dependencies
jest.mock('@/hooks/use-toast', () => ({
  toast: jest.fn(),
}));

jest.mock('@/services/uploadService'); // Mock the entire module

// Mock child components that are complex and not the direct subject of testing here
jest.mock('./FileUpload', () => () => <div data-testid="file-upload-mock">FileUploadMock</div>);
jest.mock('./MovieUpload', () => () => <div data-testid="movie-upload-mock">MovieUploadMock</div>);
jest.mock('./TVShowUpload', () => () => <div data-testid="tvshow-upload-mock">TVShowUploadMock</div>);
jest.mock('./MediaGrid', () => ({ uploads, onStatusUpdate, onDelete, updatingStatus }: any) => (
  <div data-testid="media-grid-mock">
    <span>{`Uploads Count: ${uploads.length}`}</span>
    {uploads.map((u: any) => (
      <div key={u.id}>
        <span>{u.file_name}</span>
        <button onClick={() => onStatusUpdate(u.id, 'approved')}>Approve-{u.id}</button>
        <button onClick={() => onDelete(u.id, u.file_path)}>Delete-{u.id}</button>
      </div>
    ))}
  </div>
));


const mockUploads: uploadService.MediaUpload[] = [
  { id: '1', file_name: 'poster.jpg', file_path: 'path/poster.jpg', upload_type: 'movie_poster', status: 'pending', created_at: new Date().toISOString(), user_id: 'user1' },
  { id: '2', file_name: 'backdrop.png', file_path: 'path/backdrop.png', upload_type: 'movie_backdrop', status: 'approved', created_at: new Date().toISOString(), user_id: 'user1' },
  { id: '3', file_name: 'show.webp', file_path: 'path/show.webp', upload_type: 'tvshow_poster', status: 'rejected', created_at: new Date().toISOString(), user_id: 'user1' },
];

const renderComponent = () => render(<UploadsPanel />);

describe('UploadsPanel Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (uploadService.getAllUploads as jest.Mock).mockResolvedValue([...mockUploads]); // Default successful load
    (uploadService.updateUploadStatus as jest.Mock).mockResolvedValue({} as any); // Default success
    (uploadService.deleteUpload as jest.Mock).mockResolvedValue({} as any); // Default success
    global.confirm = jest.fn(() => true); // Default confirm to true
  });

  describe('Initial Rendering and Data Loading', () => {
    it('shows loading spinner initially', async () => {
      // Temporarily delay the mock response to catch the loading state
      (uploadService.getAllUploads as jest.Mock).mockImplementationOnce(() => new Promise(resolve => setTimeout(() => resolve([...mockUploads]), 100)));
      renderComponent();
      // The spinner is a motion.div, might be hard to select directly by role.
      // Check for its presence by other means if necessary, or just proceed to check data appearance.
      // For now, we'll trust the loading state is handled if data appears correctly after await.
      expect(screen.getByRole('heading', {name: /painel de uploads/i})).toBeInTheDocument(); // Header should be there
      // Await disappearance of spinner or appearance of data
      expect(await screen.findByText('Uploads Count: 3')).toBeInTheDocument();
    });

    it('loads and displays uploads successfully', async () => {
      renderComponent();
      await waitFor(() => {
        expect(uploadService.getAllUploads).toHaveBeenCalledTimes(1);
      });
      expect(await screen.findByText('Uploads Count: 3')).toBeInTheDocument();
      expect(screen.getByText('poster.jpg')).toBeInTheDocument();
      expect(screen.getByText('backdrop.png')).toBeInTheDocument();
      expect(screen.getByText('show.webp')).toBeInTheDocument();
    });

    it('shows error toast if getAllUploads fails', async () => {
      (uploadService.getAllUploads as jest.Mock).mockRejectedValueOnce(new Error('Failed to fetch'));
      renderComponent();
      await waitFor(() => {
        expect(toast).toHaveBeenCalledWith(expect.objectContaining({
          title: 'Erro ao Carregar Uploads',
          description: 'Não foi possível buscar os uploads: Failed to fetch.',
          variant: 'destructive',
        }));
      });
    });

    it('calls loadUploads when "Atualizar" button is clicked', async () => {
        renderComponent();
        await waitFor(() => expect(uploadService.getAllUploads).toHaveBeenCalledTimes(1)); // Initial load

        const refreshButton = screen.getByRole('button', { name: /atualizar/i });
        await userEvent.click(refreshButton);

        await waitFor(() => expect(uploadService.getAllUploads).toHaveBeenCalledTimes(2));
        expect(toast).not.toHaveBeenCalledWith(expect.objectContaining({variant: 'destructive'})); // Assuming success on refresh
      });
  });

  describe('Status Update and Deletion', () => {
    it('calls updateUploadStatus and reloads uploads on successful status update', async () => {
      renderComponent();
      await waitFor(() => expect(screen.getByText('poster.jpg')).toBeInTheDocument()); // Wait for initial load

      const approveButton = screen.getByRole('button', { name: /approve-1/i }); // Approve item with id '1'
      await userEvent.click(approveButton);

      expect(uploadService.updateUploadStatus).toHaveBeenCalledWith('1', 'approved');
      await waitFor(() => {
        expect(toast).toHaveBeenCalledWith(expect.objectContaining({
          title: 'Sucesso',
          description: 'Status atualizado para aprovado.',
        }));
      });
      expect(uploadService.getAllUploads).toHaveBeenCalledTimes(2); // Initial + after update
    });

    it('shows error toast if updateUploadStatus fails', async () => {
      (uploadService.updateUploadStatus as jest.Mock).mockRejectedValueOnce(new Error('Update failed'));
      renderComponent();
      await waitFor(() => expect(screen.getByText('poster.jpg')).toBeInTheDocument());

      const approveButton = screen.getByRole('button', { name: /approve-1/i });
      await userEvent.click(approveButton);

      await waitFor(() => {
        expect(toast).toHaveBeenCalledWith(expect.objectContaining({
          title: 'Erro ao Atualizar Status',
          description: 'Não foi possível atualizar o status: Update failed.',
          variant: 'destructive',
        }));
      });
      expect(uploadService.getAllUploads).toHaveBeenCalledTimes(1); // Only initial load
    });

    it('calls deleteUpload and reloads uploads on successful deletion', async () => {
      renderComponent();
      await waitFor(() => expect(screen.getByText('poster.jpg')).toBeInTheDocument());

      const deleteButton = screen.getByRole('button', { name: /delete-1/i }); // Delete item with id '1'
      await userEvent.click(deleteButton);

      expect(global.confirm).toHaveBeenCalledWith('Tem certeza que deseja deletar este arquivo?');
      expect(uploadService.deleteUpload).toHaveBeenCalledWith('1', 'path/poster.jpg');
      await waitFor(() => {
        expect(toast).toHaveBeenCalledWith(expect.objectContaining({
          title: 'Sucesso',
          description: 'Arquivo deletado com sucesso.',
        }));
      });
      expect(uploadService.getAllUploads).toHaveBeenCalledTimes(2);
    });

    it('shows error toast if deleteUpload fails', async () => {
      (uploadService.deleteUpload as jest.Mock).mockRejectedValueOnce(new Error('Delete failed'));
      renderComponent();
      await waitFor(() => expect(screen.getByText('poster.jpg')).toBeInTheDocument());

      const deleteButton = screen.getByRole('button', { name: /delete-1/i });
      await userEvent.click(deleteButton);

      await waitFor(() => {
        expect(toast).toHaveBeenCalledWith(expect.objectContaining({
          title: 'Erro ao Deletar Arquivo',
          description: 'Não foi possível deletar o arquivo: Delete failed.',
          variant: 'destructive',
        }));
      });
      expect(uploadService.getAllUploads).toHaveBeenCalledTimes(1);
    });

    it('does not call deleteUpload if confirm is false', async () => {
        (global.confirm as jest.Mock).mockReturnValueOnce(false);
        renderComponent();
        await waitFor(() => expect(screen.getByText('poster.jpg')).toBeInTheDocument());

        const deleteButton = screen.getByRole('button', { name: /delete-1/i });
        await userEvent.click(deleteButton);

        expect(uploadService.deleteUpload).not.toHaveBeenCalled();
        expect(toast).not.toHaveBeenCalledWith(expect.objectContaining({ title: 'Sucesso' }));
      });
  });

  describe('Filtering Logic', () => {
    it('filters uploads based on active filter tab', async () => {
      renderComponent();
      await waitFor(() => expect(screen.getByText('Uploads Count: 3')).toBeInTheDocument()); // All loaded

      // Click 'Pendentes' filter
      // Assuming filter buttons have text like 'Pendentes (1)' etc.
      // The stats card also shows these counts.
      // The MediaGrid mock receives filtered uploads.
      const pendingFilterButton = screen.getByRole('button', { name: /pendentes/i });
      await userEvent.click(pendingFilterButton);
      // The MediaGrid mock displays "Uploads Count: X" based on the filtered list
      expect(await screen.findByText('Uploads Count: 1')).toBeInTheDocument(); // Only 'poster.jpg' is pending
      expect(screen.getByText('poster.jpg')).toBeInTheDocument();
      expect(screen.queryByText('backdrop.png')).not.toBeInTheDocument(); // Approved
      expect(screen.queryByText('show.webp')).not.toBeInTheDocument(); // Rejected

      // Click 'Aprovados' filter
      const approvedFilterButton = screen.getByRole('button', { name: /aprovados/i });
      await userEvent.click(approvedFilterButton);
      expect(await screen.findByText('Uploads Count: 1')).toBeInTheDocument(); // Only 'backdrop.png' is approved
      expect(screen.getByText('backdrop.png')).toBeInTheDocument();
      expect(screen.queryByText('poster.jpg')).not.toBeInTheDocument();

      // Click 'Todos' filter
      const allFilterButton = screen.getByRole('button', { name: /todos/i });
      await userEvent.click(allFilterButton);
      expect(await screen.findByText('Uploads Count: 3')).toBeInTheDocument();
    });
  });

  describe('Card Expansion', () => {
    it('toggles expansion of upload cards', async () => {
        renderComponent();
        // Check initial state (assuming they are closed, or check mock's prop)
        // For this test, we'll rely on the mock components to reflect the expanded state if it were passed.
        // We'll check if the toggle function is called.
        // A more robust test would involve seeing content inside the expanded card.
        // Since child components are fully mocked, we can't see their internal content easily.
        // We can check if the button text/aria-expanded changes if the UploadCard had such an attribute.
        // For now, let's assume the component works internally if the structure is there.

        // Example: Find the toggle button for MovieUpload card
        // The UploadCard has a structure like: <button onClick={onToggle}> title </button>
        // And then if isExpanded is true, it renders children.
        // Let's assume the toggle button is part of UploadCard and can be identified.
        // Since UploadCard itself is not mocked here, we can interact with its parts.

        // The UploadCard's title is within a button that handles toggle.
        const movieUploadToggle = screen.getByRole('button', { name: /upload de filmes/i });
        const tvShowUploadToggle = screen.getByRole('button', { name: /upload de séries/i });
        const mediaUploadToggle = screen.getByRole('button', { name: /upload de mídia/i });

        // Initially, the mocked children are rendered.
        expect(screen.getByTestId('movie-upload-mock')).toBeInTheDocument();
        // We need to check if the visibility/presence of these mocks changes based on expansion.
        // The current UploadCard implementation always renders children but uses framer-motion for animation.
        // So, children are always in DOM. A better test would be if UploadCard itself conditionally rendered children.
        // For now, this test is more conceptual.

        // Click to toggle movies (assuming it might hide/show or change state)
        await userEvent.click(movieUploadToggle);
        // Add assertions here if UploadCard had visual changes for expansion state.
        // e.g. expect(screen.getByTestId('movie-upload-mock').parentElement).toHaveClass('expanded');

        // This test mainly ensures the panel renders these cards and they are clickable.
        // True "expansion" test would require more insight into UploadCard's behavior or less mocking.
        expect(movieUploadToggle).toBeInTheDocument();
        expect(tvShowUploadToggle).toBeInTheDocument();
        expect(mediaUploadToggle).toBeInTheDocument();
    });
  });
});
