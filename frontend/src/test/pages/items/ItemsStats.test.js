import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import ItemsStats from '../../../pages/items/ItemsStats';
import { useData } from '../../../state/DataContext';
import '@testing-library/jest-dom';

jest.mock('../../../state/DataContext', () => ({
  useData: jest.fn(),
}));

jest.mock('../../../pages/LoadingSpinner', () => (props) => (
  <div data-testid="loading-spinner" />
));

describe('ItemsStats', () => {
  let fetchStatsMock;

  beforeEach(() => {
    fetchStatsMock = jest.fn(() => Promise.resolve());
    useData.mockReturnValue({
      stats: { total: undefined, averagePrice: 0 },
      fetchStats: fetchStatsMock,
    });
    jest.clearAllMocks();
  });

  it('calls fetchStats on mount', async () => {
    render(<ItemsStats />);
    await waitFor(() => expect(fetchStatsMock).toHaveBeenCalledTimes(1));
  });

  it('renders LoadingSpinner if stats.total is undefined', () => {
    useData.mockReturnValue({
      stats: { total: undefined, averagePrice: 0 },
      fetchStats: fetchStatsMock,
    });
    render(<ItemsStats />);
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('renders the average price and total items when stats are present', () => {
    useData.mockReturnValue({
      stats: { total: 10, averagePrice: 12.3456 },
      fetchStats: fetchStatsMock,
    });
    render(<ItemsStats />);
    expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
    expect(screen.getByText(/\$ 12.35/i)).toBeInTheDocument(); // rounded to 2 decimals
    expect(screen.getByText(/10 items/i)).toBeInTheDocument();
  });

  it('handles fetchStats rejection with error other than AbortError', async () => {
    const error = new Error('Failed');
    fetchStatsMock = jest.fn(() => Promise.reject(error));
    useData.mockReturnValue({
      stats: { total: undefined, averagePrice: 0 },
      fetchStats: fetchStatsMock,
    });

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    render(<ItemsStats />);
    await waitFor(() => {
      expect(fetchStatsMock).toHaveBeenCalled();
    });

    // Give time for the catch to run (promise rejection)
    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(error);
    });

    consoleErrorSpy.mockRestore();
  });
});
