import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NewItem from '../../pages/NewItem';
import { postItemToAPI } from '../../services/items';
import { useNavigate } from 'react-router-dom';

jest.mock('../../services/items', () => ({
  postItemToAPI: jest.fn()
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn()
}));

describe('NewItem Component', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useNavigate.mockReturnValue(mockNavigate);
  });

  it('renders form inputs and submit button', () => {
    render(<NewItem />);

    expect(screen.getByLabelText(/Item Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Category/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Price/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Add Item/i })).toBeInTheDocument();
  });

  it('allows user to input values into the form', async () => {
    render(<NewItem />);
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/Item Name/i), 'Notebook');
    await user.type(screen.getByLabelText(/Category/i), 'Stationery');
    await user.type(screen.getByLabelText(/Price/i), '9.99');

    expect(screen.getByLabelText(/Item Name/i)).toHaveValue('Notebook');
    expect(screen.getByLabelText(/Category/i)).toHaveValue('Stationery');
    expect(screen.getByLabelText(/Price/i)).toHaveValue(9.99);
  });

  it('calls postItemToAPI with correct data and navigates on submit', async () => {
    const user = userEvent.setup();
    postItemToAPI.mockResolvedValueOnce(); // Simulate successful API call

    render(<NewItem />);

    await user.type(screen.getByLabelText(/Item Name/i), 'Pen');
    await user.type(screen.getByLabelText(/Category/i), 'Office');
    await user.type(screen.getByLabelText(/Price/i), '1.25');

    await user.click(screen.getByRole('button', { name: /Add Item/i }));

    expect(postItemToAPI).toHaveBeenCalledWith({
      name: 'Pen',
      category: 'Office',
      price: 1.25
    });

    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('requires all fields to be filled before submission', async () => {
    const user = userEvent.setup();
    render(<NewItem />);

    await user.click(screen.getByRole('button', { name: /Add Item/i }));

    expect(postItemToAPI).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});

