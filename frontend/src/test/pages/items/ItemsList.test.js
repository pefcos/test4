import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import ItemsList from '../../../components/items/ItemsList';
import { useData } from '../../../state/DataContext';
import { MemoryRouter } from 'react-router-dom';
import * as DataContext from '../../../state/DataContext';
import '@testing-library/jest-dom';

jest.mock('../../../state/DataContext', () => ({
  useData: jest.fn(),
}));

jest.mock('react-window', () => {
  const React = require('react');
  return {
    FixedSizeList: ({ itemCount, itemData, children }) => (
      <div data-testid="fixed-size-list">
        {Array.from({ length: itemCount }).map((_, index) => (
          <div key={index}>
            {children({ index, style: {}, data: itemData })}
          </div>
        ))}
      </div>
    ),
  };
});


describe('ItemsList', () => {
  let fetchItemsMock;

  beforeEach(() => {
    fetchItemsMock = jest.fn(() => Promise.resolve());
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('calls fetchItems on mount', async () => {
    useData.mockReturnValue({
      items: [],
      fetchItems: fetchItemsMock,
    });

    render(
      <MemoryRouter>
        <ItemsList />
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(fetchItemsMock).toHaveBeenCalled();
    });
  });

  it('shows a loading spinner if items are undefined', () => {
    useData.mockReturnValue({
      items: undefined,
      fetchItems: fetchItemsMock,
    });

    render(
      <MemoryRouter>
        <ItemsList />
      </MemoryRouter>
    );
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('shows "No items found." when items is an empty array', async () => {
    useData.mockReturnValue({
      items: [],
      fetchItems: fetchItemsMock,
    });

    render(
      <MemoryRouter>
        <ItemsList />
      </MemoryRouter>
    );
    expect(await screen.findByText('No items found.')).toBeInTheDocument();
  });

  it('renders the list when items are available', async () => {
    const mockItems = [
      { id: 1, name: 'Item 1', category: 'A', price: 10 },
      { id: 2, name: 'Item 2', category: 'B', price: 20 },
    ];

    useData.mockReturnValue({
      items: mockItems,
      fetchItems: fetchItemsMock,
    });

    render(
      <MemoryRouter>
        <ItemsList />
      </MemoryRouter>
    );
    expect(await screen.findByTestId('fixed-size-list')).toBeInTheDocument();
  });
});
