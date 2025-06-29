import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import ItemsList from '../../../pages/items/ItemsList';
import { DataContext } from '../../../state/DataContext';
import { useNavigate } from 'react-router-dom';

// Mock react-router
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

describe('ItemsList', () => {
  let fetchItemsMock;

  const renderWithContext = (contextValue) => {
    render(
      <DataContext.Provider value={contextValue}>
        <ItemsList />
      </DataContext.Provider>
    );
  };

  beforeEach(() => {
    fetchItemsMock = jest.fn().mockResolvedValue();
  });

  test('calls fetchItems on mount', async () => {
    renderWithContext({ items: [], fetchItems: fetchItemsMock });

    await waitFor(() => {
      expect(fetchItemsMock).toHaveBeenCalledTimes(1);
    });
  });

  test('shows loading spinner when items are undefined', () => {
    renderWithContext({ items: undefined, fetchItems: fetchItemsMock });

    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  test('shows empty message when items list is empty', async () => {
    renderWithContext({ items: [], fetchItems: fetchItemsMock });

    expect(await screen.findByText(/no items found/i)).toBeInTheDocument();
  });

  test('renders list when items are present', async () => {
    const mockItems = [
      { id: '1', name: 'Item 1', category: 'A', price: 10 },
      { id: '2', name: 'Item 2', category: 'B', price: 20 },
    ];

    renderWithContext({ items: mockItems, fetchItems: fetchItemsMock });

    expect(await screen.findByText(/name/i)).toBeInTheDocument();
    expect(fetchItemsMock).toHaveBeenCalledTimes(1);
  });
});

