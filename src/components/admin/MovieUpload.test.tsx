import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MovieUpload from './MovieUpload';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

// Mocking external dependencies
jest.mock('@/hooks/use-toast', () => ({
  toast: jest.fn(),
}));

jest.mock('@/integrations/supabase/client', () => {
  const mockSupabase = {
    from: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    single: jest.fn(), // Default mock for single()
    upsert: jest.fn().mockReturnThis(),
  };
  // Default behavior for single() can be a successful main item insertion
  mockSupabase.single.mockResolvedValue({ data: { id: 'mock-movie-id-default' }, error: null });
  return { supabase: mockSupabase };
});

const renderComponent = () => render(<MovieUpload />);

describe('MovieUpload Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Initial Rendering and Default Values', () => {
    it('renders without crashing', () => {
      renderComponent();
      expect(screen.getByRole('heading', { name: /adicionar filme/i })).toBeInTheDocument();
    });

    it('sets default form values correctly', () => {
      renderComponent();
      expect(screen.getByLabelText(/título \*/i)).toHaveValue('');
      const yearInput = screen.getByLabelText(/ano \*/i) as HTMLInputElement;
      expect(yearInput.value).toMatch(/^\d{4}$/); // Year is pre-filled
      expect(screen.getByLabelText(/qualidade \*/i)).toHaveValue('HD');
      expect(screen.getByLabelText(/duração \*/i)).toHaveValue('');
    });
  });

  describe('Form Field Validation', () => {
    it('shows required error for title when submitting empty', async () => {
      renderComponent();
      const submitButton = screen.getByRole('button', { name: /adicionar filme/i });
      await userEvent.click(submitButton);
      expect(await screen.findByText('Título é obrigatório')).toBeInTheDocument();
      expect(toast).not.toHaveBeenCalled();
    });

    it('shows required error and format error for year', async () => {
      renderComponent();
      const yearInput = screen.getByLabelText(/ano \*/i);
      const submitButton = screen.getByRole('button', { name: /adicionar filme/i });

      await userEvent.clear(yearInput);
      await userEvent.click(submitButton);
      expect(await screen.findByText('Ano deve ter 4 dígitos')).toBeInTheDocument();

      await userEvent.type(yearInput, '123');
      await userEvent.click(submitButton);
      expect(await screen.findByText('Ano deve ter 4 dígitos')).toBeInTheDocument();
    });

    it('shows required error for duration', async () => {
      renderComponent();
      const submitButton = screen.getByRole('button', { name: /adicionar filme/i });
      // Duration field is empty by default
      await userEvent.click(submitButton);
      expect(await screen.findByText('Duração é obrigatória')).toBeInTheDocument();
    });

    it('shows required error for rating', async () => {
      renderComponent();
      const submitButton = screen.getByRole('button', { name: /adicionar filme/i });
      // Rating field is empty by default
      await userEvent.click(submitButton);
      expect(await screen.findByText('Classificação é obrigatória')).toBeInTheDocument();
    });

    it('shows required error for quality', async () => {
      renderComponent();
      const qualityInput = screen.getByLabelText(/qualidade \*/i);
      await userEvent.clear(qualityInput); // Default is HD, so clear it
      const submitButton = screen.getByRole('button', { name: /adicionar filme/i });
      await userEvent.click(submitButton);
      expect(await screen.findByText('Qualidade é obrigatória')).toBeInTheDocument();
    });

    it('shows required error and min length for plot', async () => {
      renderComponent();
      const plotInput = screen.getByLabelText(/sinopse \*/i);
      const submitButton = screen.getByRole('button', { name: /adicionar filme/i });

      await userEvent.clear(plotInput);
      await userEvent.click(submitButton);
      expect(await screen.findByText('Sinopse deve ter pelo menos 10 caracteres')).toBeInTheDocument();

      await userEvent.type(plotInput, 'short');
      await userEvent.click(submitButton);
      expect(await screen.findByText('Sinopse deve ter pelo menos 10 caracteres')).toBeInTheDocument();
    });

    it('shows URL format error for poster, backdrop, and playerUrl', async () => {
      renderComponent();
      const posterInput = screen.getByLabelText(/url do poster \*/i);
      const backdropInput = screen.getByLabelText(/url do backdrop \*/i);
      const playerUrlInput = screen.getByLabelText(/url do player \*/i);
      const submitButton = screen.getByRole('button', { name: /adicionar filme/i });

      await userEvent.type(posterInput, 'invalid-url');
      await userEvent.type(backdropInput, 'another-invalid');
      await userEvent.type(playerUrlInput, 'yet-another');
      await userEvent.click(submitButton);

      expect(await screen.findByText('URL do poster inválida')).toBeInTheDocument();
      expect(await screen.findByText('URL do backdrop inválida')).toBeInTheDocument();
      expect(await screen.findByText('URL do player inválida')).toBeInTheDocument();
    });
  });

  describe('Dynamic Field Arrays (Actors, Directors, etc.)', () => {
    const testDynamicFieldArray = async (fieldTitle: string, inputPlaceholder: RegExp) => {
      renderComponent();

      let inputs = screen.getAllByPlaceholderText(inputPlaceholder);
      expect(inputs).toHaveLength(1); // Starts with one input

      const addButton = screen.getAllByRole('button', { name: /adicionar/i }).find(btn => btn.textContent?.includes(fieldTitle));
      expect(addButton).toBeInTheDocument();

      if (addButton) {
         await userEvent.click(addButton);
      }
      inputs = screen.getAllByPlaceholderText(inputPlaceholder);
      expect(inputs).toHaveLength(2); // Should have two inputs now

      await userEvent.type(inputs[0], `${fieldTitle} One`);
      await userEvent.type(inputs[1], `${fieldTitle} Two`);
      expect(inputs[0]).toHaveValue(`${fieldTitle} One`);
      expect(inputs[1]).toHaveValue(`${fieldTitle} Two`);

      // Test removing a field
      // There should be two remove buttons now, one for each input.
      const removeButtons = screen.getAllByRole('button', { name: /x/i });
      expect(removeButtons.length).toBeGreaterThanOrEqual(1); // At least one remove for this group

      // Remove the second field we added
      // This assumes the remove button is a sibling or near the input it controls
      // and that the order of remove buttons corresponds to input order.
      // This might need adjustment if the DOM structure is different.
      // Let's assume the remove button for the second input is the last one for this group
      // or rely on a more specific selector if needed.
      // For simplicity, clicking the last one (if multiple groups exist, this is still tricky)
      // Let's find the remove button associated with the second input of this specific group.
      // This requires that the remove button is structurally close to the input.
      // A common pattern is input and button are siblings in a div.
      // We'll click the remove button associated with the second input.
      // The current structure has remove buttons appear only when values.length > 1.
      // So after adding one, the first one doesn't have X, second one does.
      // After adding the second input, there will be two inputs and one X button (for the second input).
      // If we want to remove the first input, we need to make sure it has an X button.
      // The logic is: if (values.length > 1) then show X.
      // So if we have 2 inputs, both should have an X button.

      // Let's refine: After adding one field, we have 2 inputs. Both have X buttons.
      // Click the X button for the second input.
      await userEvent.click(inputs[1].nextElementSibling as HTMLElement); // Assuming X is the next sibling

      inputs = screen.getAllByPlaceholderText(inputPlaceholder);
      expect(inputs).toHaveLength(1);
      expect(inputs[0]).toHaveValue(`${fieldTitle} One`); // First one remains
    };

    it('allows adding and removing actor fields', async () => {
      await testDynamicFieldArray('Atores', /nome ator/i);
    });

    it('allows adding and removing director fields', async () => {
      await testDynamicFieldArray('Diretores', /nome diretor/i);
    });

    it('allows adding and removing producer fields', async () => {
      await testDynamicFieldArray('Produtores', /nome produtor/i);
    });

    it('allows adding and removing category fields', async () => {
      await testDynamicFieldArray('Categorias', /nome categoria/i);
    });
  });

  describe('onSubmit Function Logic', () => {
    const fillValidMainMovieForm = async () => {
        await userEvent.type(screen.getByLabelText(/título \*/i), 'Test Movie Title');
        // Year is pre-filled, ensure it's valid if needed or clear and type
        // await userEvent.clear(screen.getByLabelText(/ano \*/i));
        // await userEvent.type(screen.getByLabelText(/ano \*/i), '2022');
        await userEvent.type(screen.getByLabelText(/duração \*/i), '120 min');
        await userEvent.type(screen.getByLabelText(/classificação \*/i), '7.5');
        // Quality is HD by default
        await userEvent.type(screen.getByLabelText(/sinopse \*/i), 'A great movie plot that is long enough.');
        await userEvent.type(screen.getByLabelText(/url do poster \*/i), 'http://example.com/poster.jpg');
        await userEvent.type(screen.getByLabelText(/url do backdrop \*/i), 'http://example.com/backdrop.jpg');
        await userEvent.type(screen.getByLabelText(/url do player \*/i), 'http://example.com/player.mp4');
    };

    it('successfully submits with valid data and related entities', async () => {
        const mockMovieId = 'movie-id-success';
        const mockActorId = 'actor-id-success';
        const mockCategoryId = 'category-id-success';

        // @ts-ignore
        supabase.from.mockImplementation((tableName: string) => {
            if (tableName === 'movies') {
                return { insert: jest.fn().mockReturnThis(), select: jest.fn().mockReturnThis(), single: jest.fn().mockResolvedValueOnce({ data: { id: mockMovieId }, error: null }) };
            }
            if (tableName === 'actors') {
                return { upsert: jest.fn().mockResolvedValueOnce({ data: { id: mockActorId }, error: null }), select: jest.fn().mockReturnThis(), single: jest.fn() };
            }
            if (tableName === 'movie_actors') {
                return { insert: jest.fn().mockResolvedValueOnce({ error: null }) };
            }
            if (tableName === 'categories') {
                return { upsert: jest.fn().mockResolvedValueOnce({ data: { id: mockCategoryId }, error: null }), select: jest.fn().mockReturnThis(), single: jest.fn() };
            }
            if (tableName === 'movie_categories') {
                return { insert: jest.fn().mockResolvedValueOnce({ error: null }) };
            }
            return {
                upsert: jest.fn().mockResolvedValue({ data: { id: 'other-id' }, error: null }),
                insert: jest.fn().mockResolvedValue({ error: null }),
                select: jest.fn().mockReturnThis(), single: jest.fn()
            };
        });

        renderComponent();
        await fillValidMainMovieForm();

        // Add an actor
        const actorInputs = screen.getAllByPlaceholderText(/nome ator/i);
        await userEvent.type(actorInputs[0], 'Actor Test');

        // Add a category
        const categoryInputs = screen.getAllByPlaceholderText(/nome categoria/i);
        await userEvent.type(categoryInputs[0], 'Category Test');

        const submitButton = screen.getByRole('button', { name: /adicionar filme/i });
        await userEvent.click(submitButton);

        await waitFor(() => {
            expect(supabase.from).toHaveBeenCalledWith('movies');
            // @ts-ignore
            expect(supabase.from('movies').insert.mock.calls[0][0].title).toBe('Test Movie Title');

            expect(supabase.from).toHaveBeenCalledWith('actors');
            // @ts-ignore
            expect(supabase.from('actors').upsert.mock.calls[0][0]).toEqual({ name: 'Actor Test' });
            expect(supabase.from).toHaveBeenCalledWith('movie_actors');
            // @ts-ignore
            expect(supabase.from('movie_actors').insert.mock.calls[0][0]).toEqual({ movie_id: mockMovieId, actor_id: mockActorId });

            expect(supabase.from).toHaveBeenCalledWith('categories');
            // @ts-ignore
            expect(supabase.from('categories').upsert.mock.calls[0][0]).toEqual({ name: 'Category Test' });
            expect(supabase.from).toHaveBeenCalledWith('movie_categories');
            // @ts-ignore
            expect(supabase.from('movie_categories').insert.mock.calls[0][0]).toEqual({ movie_id: mockMovieId, category_id: mockCategoryId });
        });

        expect(toast).toHaveBeenCalledWith(expect.objectContaining({ title: 'Sucesso!' }));
        expect(screen.getByLabelText(/título \*/i)).toHaveValue(''); // Form reset
    });

    it('shows specific error toast on main movie insertion failure', async () => {
        // @ts-ignore
        supabase.from.mockImplementation((tableName: string) => {
            if (tableName === 'movies') {
                return { insert: jest.fn().mockReturnThis(), select: jest.fn().mockReturnThis(), single: jest.fn().mockResolvedValueOnce({ data: null, error: { message: 'DB error on movie insert' } }) };
            }
            return { upsert: jest.fn(), insert: jest.fn(), select: jest.fn(), single: jest.fn() };
        });

        renderComponent();
        await fillValidMainMovieForm();

        const submitButton = screen.getByRole('button', { name: /adicionar filme/i });
        await userEvent.click(submitButton);

        await waitFor(() => {
            expect(toast).toHaveBeenCalledWith(expect.objectContaining({
                title: 'Erro ao Salvar Filme',
                description: 'Falha na operação: Falha ao inserir dados principais do filme: DB error on movie insert',
                variant: 'destructive',
            }));
        });
    });

    it('shows specific error toast on related entity (actors) insertion failure', async () => {
        const mockMovieId = 'movie-err-actor';
        // @ts-ignore
        supabase.from.mockImplementation((tableName: string) => {
            if (tableName === 'movies') {
                return { insert: jest.fn().mockReturnThis(), select: jest.fn().mockReturnThis(), single: jest.fn().mockResolvedValueOnce({ data: { id: mockMovieId }, error: null }) };
            }
            if (tableName === 'actors') { // This is the one that will fail
                return { upsert: jest.fn().mockRejectedValue(new Error('Failed to upsert actor')), select: jest.fn().mockReturnThis(), single: jest.fn() };
            }
            return { upsert: jest.fn(), insert: jest.fn(), select: jest.fn(), single: jest.fn() };
        });

        renderComponent();
        await fillValidMainMovieForm();
        const actorInputs = screen.getAllByPlaceholderText(/nome ator/i);
        await userEvent.type(actorInputs[0], 'Problem Actor');

        const submitButton = screen.getByRole('button', { name: /adicionar filme/i });
        await userEvent.click(submitButton);

        await waitFor(() => {
            expect(toast).toHaveBeenCalledWith(expect.objectContaining({
                title: 'Erro ao Salvar Filme',
                // This message comes from the throw new Error in onSubmit
                description: 'Falha na operação: Falha ao adicionar atores: Failed to upsert actor',
                variant: 'destructive',
            }));
        });
         // Check that main movie was attempted, but related data failed
        expect(supabase.from).toHaveBeenCalledWith('movies');
        expect(supabase.from).toHaveBeenCalledWith('actors');
    });

  });
});
