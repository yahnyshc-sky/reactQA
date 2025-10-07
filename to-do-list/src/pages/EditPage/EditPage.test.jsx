import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock react-router-dom BEFORE importing component
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
	useParams: () => ({ id: '123' }),
	useNavigate: () => mockNavigate,
}), { virtual: true });

import EditPage from './EditPage';

// Mock child components to isolate EditPage behaviour
jest.mock('../../components/header/Header', () => () => <div data-testid="header" />);
jest.mock('../../components/footer/Footer', () => () => <div data-testid="footer" />);

describe('EditPage', () => {
	const TODO_API_URL = 'http://localhost:5000/todo/123';

	beforeEach(() => {
		mockNavigate.mockReset();
		// Provide a default successful fetch mock; individual tests can override
		global.fetch = jest.fn((url, options) => {
			if (!options) { // initial GET
				return Promise.resolve({
					ok: true,
					json: () => Promise.resolve({
						_id: '123',
						description: 'Initial Desc',
						created_at: '2024-06-10T00:00:00Z',
						completed: true,
					}),
				});
			}
			// PATCH path
			return Promise.resolve({ ok: true });
		});
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	const renderEditPage = () => render(<EditPage />);

	it('renders loading state initially', () => {
		// Delay fetch resolution to capture loading UI
		global.fetch = jest.fn(() => new Promise(() => {})); // never resolves
		renderEditPage();
		expect(screen.getByText(/loading/i)).toBeInTheDocument();
	});

	it('fetches and displays existing todo data', async () => {
		renderEditPage();

		// Wait for form (loading removed) and ensure inputs populated
		await waitFor(() => expect(screen.queryByText(/loading/i)).not.toBeInTheDocument());

		const descriptionInput = screen.getByTestId('description-input');
		expect(descriptionInput).toBeInTheDocument();
		expect(descriptionInput).toHaveValue('Initial Desc');

		// Created on date text (formatted dd/mm/yyyy). We test partial due to locale formatting.
		const dateText = screen.getByText(/created on:/i);
		expect(dateText).toBeInTheDocument();

		const checkbox = screen.getByRole('checkbox', { name: /completed/i });
		expect(checkbox).toBeChecked();

		// Ensure fetch GET called with correct URL
		expect(global.fetch).toHaveBeenCalledWith(TODO_API_URL);
	});

	it('allows editing description and toggling completed then submitting PATCH', async () => {
		renderEditPage();

		await waitFor(() => expect(screen.queryByText(/loading/i)).not.toBeInTheDocument());

		const descriptionInput = screen.getByTestId('description-input');
		const checkbox = screen.getByRole('checkbox', { name: /completed/i });
		const submitBtn = screen.getByTestId('submit-btn');

		fireEvent.change(descriptionInput, { target: { value: 'Updated Task' } });
		expect(descriptionInput).toHaveValue('Updated Task');

		fireEvent.click(checkbox); // toggle off
		expect(checkbox).not.toBeChecked();

		fireEvent.click(submitBtn);

		await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/'));

		// Verify PATCH call structure
		const patchCall = global.fetch.mock.calls.find((c) => c[1] && c[1].method === 'PATCH');
		expect(patchCall).toBeTruthy();
		expect(patchCall[0]).toBe(TODO_API_URL);
		const body = JSON.parse(patchCall[1].body);
		expect(body.description).toBe('Updated Task');
		expect(body.completed).toBe(false); // toggled
	});

	it('handles failed fetch on initial load gracefully', async () => {
		global.fetch = jest.fn(() => Promise.resolve({ ok: false }));
		renderEditPage();
		await waitFor(() => expect(screen.queryByText(/loading/i)).not.toBeInTheDocument());

		// Form should still render with empty description
		const descriptionInput = screen.getByTestId('description-input');
		expect(descriptionInput).toBeInTheDocument();
		expect(descriptionInput).toHaveValue('');
	});

	it('does not navigate when PATCH fails', async () => {
		// First call (GET) success, second (PATCH) fails
		global.fetch = jest.fn()
			.mockImplementationOnce(() => Promise.resolve({
				ok: true,
				json: () => Promise.resolve({
					_id: '123',
					description: 'Initial Desc',
					created_at: '2024-06-10 00:00:00',
					completed: false,
				}),
			}))
			.mockImplementationOnce(() => Promise.resolve({ ok: false }));

		renderEditPage();
		await waitFor(() => expect(screen.queryByText(/loading/i)).not.toBeInTheDocument());

		fireEvent.change(screen.getByTestId('description-input'), { target: { value: 'Try Submit' } });
		fireEvent.click(screen.getByTestId('submit-btn'));

		// Small wait to allow promise chain
		await waitFor(() => expect(mockNavigate).not.toHaveBeenCalled());
	});
});

