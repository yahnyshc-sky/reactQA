import React from 'react';
import { render, screen } from '@testing-library/react';
import Header from './Header';
import '@testing-library/jest-dom';

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

describe('Header', () => {

    describe('Header', () => {
        const renderWithRouter = (ui) => render(ui);

        it('renders without crashing', () => {
            renderWithRouter(<Header />);
        });

        it('renders the QA logo link with correct attributes', () => {
            renderWithRouter(<Header />);
            const qaLink = screen.getByRole('link', { name: /qa ltd/i });
            expect(qaLink).toBeInTheDocument();
            expect(qaLink).toHaveAttribute('href', 'https://www.qa.com');
            expect(qaLink).toHaveAttribute('target', '_blank');
            expect(qaLink).toHaveAttribute('rel', 'noopener noreferrer');

            const logoImg = screen.getByAltText(/qa ltd/i);
            expect(logoImg).toBeInTheDocument();
            expect(logoImg).toHaveClass('qa-logo');
        });

        it('renders the app title', () => {
            renderWithRouter(<Header />);
            const heading = screen.getByRole('heading', { name: /todo app/i });
            expect(heading).toBeInTheDocument();
        });

        it('renders navigation links with correct hrefs and classes', () => {
            renderWithRouter(<Header />);
            const allTodosLink = screen.getByRole('link', { name: /all todos/i });
            const addTodoLink = screen.getByTestId('addTodoLink');

            expect(allTodosLink).toBeInTheDocument();
            expect(addTodoLink).toBeInTheDocument();

            expect(allTodosLink).toHaveAttribute('href', '/');
            expect(addTodoLink).toHaveAttribute('href', '/add');

            expect(allTodosLink).toHaveClass('nav-link');
            expect(addTodoLink).toHaveClass('nav-link');
        });

        it('renders the navbar with the brand color', () => {
            renderWithRouter(<Header />);
            const nav = screen.getByRole('navigation');
            expect(nav).toBeInTheDocument();
            expect(nav).toHaveStyle({ backgroundColor: '#14EAB8' });
        });
    });
});
