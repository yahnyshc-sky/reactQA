import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
const router = require('react-router');
const AddPage = require('./AddPage').default;

jest.mock('react-router', () => ({
    NavLink: ({ to, className, children, ...rest }) => {
        const classNameValue = typeof className === 'function' ? className({ isActive: false }) : className;
        return (
            <a href={to} className={classNameValue} {...rest}>
                {children}
            </a>
        );
    },
}));
jest.mock('../../components/header/Header', () => () => <div data-testid="header" />);
jest.mock('../../components/footer/Footer', () => () => <div data-testid="footer" />);

const mockedNavigate = jest.fn();
router.useNavigate = () => mockedNavigate;

let originalFetch;
beforeEach(() => {
    originalFetch = global.fetch;
    global.fetch = jest.fn();
    mockedNavigate.mockClear();
});

afterEach(() => {
    global.fetch = originalFetch;
    jest.clearAllMocks();
});

const renderAddPage = () => {
    return render(<AddPage />);
};

test('renders AddPage form elements', () => {
    renderAddPage();

    expect(screen.getByRole('heading', { name: /add todo/i })).toBeInTheDocument();
    expect(screen.getByTestId('description-input')).toBeInTheDocument();
    expect(screen.getByTestId('completed-checkbox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
    expect(screen.getByText(/^Created on:/i)).toBeInTheDocument();
});

test('submits form with default completed=false and navigates on success', async () => {
    global.fetch.mockResolvedValueOnce({ ok: true });

    renderAddPage();

    await userEvent.type(screen.getByTestId('description-input'), 'Buy milk');
    await userEvent.click(screen.getByRole('button', { name: /submit/i }));

    expect(global.fetch).toHaveBeenCalledTimes(1);
    const [url, options] = global.fetch.mock.calls[0];
    expect(url).toBe('http://localhost:8000/todos/');
    expect(options.method).toBe('POST');
    expect(options.headers['Content-Type']).toBe('application/json');

    const body = JSON.parse(options.body);
    expect(body).toMatchObject({
        todoDescription: 'Buy milk',
        todoCompleted: false,
    });
    expect(typeof body.todoDateCreated).toBe('string');

    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith('/'));
});

test('submits form with completed=true when checkbox is checked', async () => {
    global.fetch.mockResolvedValueOnce({ ok: true });

    renderAddPage();

    await userEvent.type(screen.getByTestId('description-input'), 'Finish task');
    await userEvent.click(screen.getByTestId('completed-checkbox'));
    await userEvent.click(screen.getByRole('button', { name: /submit/i }));

    const [, options] = global.fetch.mock.calls[0];
    const body = JSON.parse(options.body);
    expect(body.todoDescription).toBe('Finish task');
    expect(body.todoCompleted).toBe(true);
    expect(typeof body.todoDateCreated).toBe('string');

    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith('/'));
});

test('does not navigate on failed response and logs error', async () => {
    global.fetch.mockResolvedValueOnce({ ok: false });
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    renderAddPage();

    await userEvent.type(screen.getByTestId('description-input'), 'Test error path');
    await userEvent.click(screen.getByRole('button', { name: /submit/i }));

    expect(global.fetch).toHaveBeenCalledTimes(1);
    await waitFor(() => {
        expect(mockedNavigate).not.toHaveBeenCalled();
        expect(errorSpy).toHaveBeenCalled();
    });

    errorSpy.mockRestore();
});
