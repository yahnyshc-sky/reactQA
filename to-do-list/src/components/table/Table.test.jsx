import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Table from './Table';

const sampleData = [
  { _id: '1', description: 'Buy milk', dateCreated: '2025-01-01' },
  { _id: '2', description: 'Walk dog', dateCreated: '2025-01-02' },
];

// Mock the ToDoListItem to render a simple row so tests don't depend on its implementation
jest.mock('../ToDoListItem/ToDoListItem', () => {
  return {
    __esModule: true,
    default: ({ data }) => (
      <tr data-testid="mock-item">
        <td>{data.description}</td>
        <td>{data.dateCreated}</td>
        <td>actions</td>
      </tr>
    ),
  };
});

describe('Table component', () => {
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(sampleData),
      })
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('renders table headers', () => {
    render(<Table />);
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByText('Date Created')).toBeInTheDocument();
    expect(screen.getByText('Action')).toBeInTheDocument();
  });

  it('fetches data and renders list items', async () => {
    render(<Table />);

    await waitFor(() => expect(global.fetch).toHaveBeenCalledWith('http://localhost:8000/todos'));

    const rows = await screen.findAllByTestId('mock-item');
    expect(rows).toHaveLength(sampleData.length);
    expect(screen.getByText('Buy milk')).toBeInTheDocument();
    expect(screen.getByText('Walk dog')).toBeInTheDocument();
  });
});