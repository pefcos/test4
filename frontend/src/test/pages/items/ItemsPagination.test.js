import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ItemsPagination from '../../../pages/items/ItemsPagination';
import { useData } from '../../../state/DataContext';

jest.mock('../../../state/DataContext', () => ({
  useData: jest.fn(),
}));

describe('ItemsPagination', () => {
  const goToPageMock = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderPagination = ({ page, totalCount, limitPerPage }) => {
    useData.mockReturnValue({
      page,
      totalCount,
      limitPerPage,
      goToPage: goToPageMock,
    });
    render(<ItemsPagination />);
  };

  it('renders nothing if there is only one or zero pages', () => {
    renderPagination({ page: 1, totalCount: 5, limitPerPage: 10 });
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument();

    renderPagination({ page: 1, totalCount: 0, limitPerPage: 10 });
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
  });

  it('disables "First" and "Previous" buttons on the first page', () => {
    renderPagination({ page: 1, totalCount: 50, limitPerPage: 10 });

    const firstButton = screen.getByText('First').closest('button');
    const prevButton = screen.getByText('Previous').closest('button');
    const nextButton = screen.getByText('Next').closest('button');
    const lastButton = screen.getByText('Last').closest('button');

    expect(firstButton).toBeDisabled();
    expect(prevButton).toBeDisabled();

    expect(nextButton).not.toBeDisabled();
    expect(lastButton).not.toBeDisabled();
  });

  it('disables "Next" and "Last" buttons on the last page', () => {
    renderPagination({ page: 5, totalCount: 50, limitPerPage: 10 });

    const firstButton = screen.getByText('First').closest('button');
    const prevButton = screen.getByText('Previous').closest('button');
    const nextButton = screen.getByText('Next').closest('button');
    const lastButton = screen.getByText('Last').closest('button');

    expect(nextButton).toBeDisabled();
    expect(lastButton).toBeDisabled();

    expect(firstButton).not.toBeDisabled();
    expect(prevButton).not.toBeDisabled();
  });

  it('enables all buttons except active page on a middle page', () => {
    renderPagination({ page: 3, totalCount: 50, limitPerPage: 10 });

    const firstButton = screen.getByText('First').closest('button');
    const prevButton = screen.getByText('Previous').closest('button');
    const nextButton = screen.getByText('Next').closest('button');
    const lastButton = screen.getByText('Last').closest('button');

    expect(firstButton).not.toBeDisabled();
    expect(prevButton).not.toBeDisabled();
    expect(nextButton).not.toBeDisabled();
    expect(lastButton).not.toBeDisabled();

    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('calls goToPage with the correct page number when buttons clicked', () => {
    renderPagination({ page: 3, totalCount: 50, limitPerPage: 10 });

    fireEvent.click(screen.getByText('First'));
    expect(goToPageMock).toHaveBeenCalledWith(1);

    fireEvent.click(screen.getByText('Previous'));
    expect(goToPageMock).toHaveBeenCalledWith(2);

    fireEvent.click(screen.getByText('Next'));
    expect(goToPageMock).toHaveBeenCalledWith(4);

    fireEvent.click(screen.getByText('Last'));
    expect(goToPageMock).toHaveBeenCalledWith(5);
  });
});
