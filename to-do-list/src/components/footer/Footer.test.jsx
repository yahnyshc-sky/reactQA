import { render, screen } from '@testing-library/react';
import { Footer } from './Footer';

describe('Footer', () => {
  it('renders the copyright text', () => {
    render(<Footer />);
    const copyright = screen.getByText(/© QA Ltd 2019-/i);
    expect(copyright).toBeInTheDocument();
  });

  it('applies the correct classes and style', () => {
    render(<Footer />);
    const footer = screen.getByRole('contentinfo');
    expect(footer).toHaveClass('mt-3');
    expect(footer).toHaveClass('px-3');
    expect(footer).toHaveClass('py-4');
    expect(footer).toHaveStyle('background-color: #14EAB8');
  });

  // Test <p> element classes
  it('applies the correct classes to the <p> element', () => {
      render(<Footer />);
      const paragraph = screen.getByText(/© QA Ltd 2019-/i);
      expect(paragraph).toHaveClass('container');
      expect(paragraph).toHaveClass('align-center');
  });
});
