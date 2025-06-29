import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ItemDetail from '../../pages/items/ItemDetail';

beforeEach(() => {
  fetch.resetMocks();
});

describe('ItemDetail Component', () => {
  test('shows loading spinner initially', () => {
    fetch.mockResponseOnce(() => new Promise(() => {})); // never resolves

    render(
      <MemoryRouter initialEntries={['/items/123']}>
        <Routes>
          <Route path="/items/:id" element={<ItemDetail />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

test('loads page after successful fetch', async () => {
    const mockItem = {
      id: '123',
      name: 'Test Item',
      category: 'Electronics',
      price: 49.99,
    };
    fetch.mockResponseOnce(JSON.stringify(mockItem));

    render(
      <MemoryRouter initialEntries={['/items/123']}>
        <Routes>
          <Route path="/items/:id" element={<ItemDetail />} />
        </Routes>
      </MemoryRouter>
    );

    // Just ensure the loading spinner is replaced and page is rendered
    expect(await screen.findByText('Test Item')).toBeInTheDocument();
  });

});

