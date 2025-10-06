import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Header from './header';

// /src/components/header/header.test.jsx
describe('Header', () => {
    it('renders without crashing', () => {
        const { container } = render(<Header />);
        expect(container.firstChild).toBeTruthy();
    });

    it('uses a semantic <header> (role="banner")', () => {
        render(<Header />);
        // If your component does not use <header>, change this to a different query.
        expect(screen.getByRole('banner')).toBeInTheDocument();
    });

    it('renders a visible heading', () => {
        render(<Header />);
        const h1 = screen.queryByRole('heading', { level: 1 });
        expect(h1 ?? screen.getByRole('heading')).toBeInTheDocument();
    });
});

