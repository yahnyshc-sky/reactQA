import React from 'react';
import { render, screen } from '@testing-library/react';
import ToDoListItem from './ToDoListItem';

jest.mock('react-router', () => ({
    Link: ({ to, className, children, ...rest }) => {
        const classNameValue = typeof className === 'function' ? className({}) : className;
        return (
            <a href={to} className={classNameValue} {...rest}>
                {children}
            </a>
        );
    },
}));

describe('ToDoListItem', () => {
    const wrap = (ui) => render(<table><tbody>{ui}</tbody></table>);

    it('renders description, formatted date and edit link when not completed', () => {
        const data = {
            _id: '123',
            todoDescription: 'Test Task',
            todoDateCreated: '2020-12-25T00:00:00Z',
            todoCompleted: false,
        };

        wrap(<ToDoListItem data={data} />);

        const descCell = screen.getByText(/test task/i);
        expect(descCell).toBeInTheDocument();
        expect(descCell).not.toHaveClass('completed');

        const dateCell = screen.getByText('25/12/2020');
        expect(dateCell).toBeInTheDocument();
        expect(dateCell).not.toHaveClass('completed');

        const editLink = screen.getByRole('link', { name: /edit/i });
        expect(editLink).toBeInTheDocument();
        expect(editLink).toHaveAttribute('href', '/edit/123');
        expect(editLink).toHaveClass('edit-link');
    });

    it('renders completed text and applies completed class when todoCompleted is true', () => {
        const data = {
            _id: 'abc',
            todoDescription: 'Complete Me',
            todoDateCreated: '2021-01-01T12:00:00Z',
            todoCompleted: true,
        };

        wrap(<ToDoListItem data={data} />);

        const descCell = screen.getByText(/complete me/i);
        expect(descCell).toBeInTheDocument();
        expect(descCell).toHaveClass('completed');
        expect(descCell).not.toHaveClass('overdue');

        const dateCell = screen.getByText('01/01/2021');
        expect(dateCell).toBeInTheDocument();
        expect(dateCell).toHaveClass('completed');
        expect(dateCell).not.toHaveClass('overdue');

        const completedText = screen.getByText(/completed task/i);
        expect(completedText).toBeInTheDocument();

        const editLink = screen.queryByRole('link', { name: /edit/i });
        expect(editLink).toBeNull();
    });

    it('applies overdue class when task is overdue and not completed', () => {
        const pastDate = new Date();
        pastDate.setDate(pastDate.getDate() - 5);
        const isoPastDate = pastDate.toISOString();

        const data = {
            _id: 'overdue1',
            todoDescription: 'Overdue Task',
            todoDateCreated: isoPastDate,
            todoCompleted: false,
        }; 
    
        wrap(<ToDoListItem data={data} />);
        
        const descCell = screen.getByText(/overdue task/i);
        expect(descCell).toBeInTheDocument();
        expect(descCell).toHaveClass('overdue');
        expect(descCell).not.toHaveClass('completed');

        const dateCell = screen.getByText(new RegExp(pastDate.toLocaleDateString('en-GB')));
        expect(dateCell).toBeInTheDocument();
        expect(dateCell).toHaveClass('overdue');
        expect(dateCell).not.toHaveClass('completed');
        
        const editLink = screen.getByRole('link', { name: /edit/i });
        expect(editLink).toBeInTheDocument();
        expect(editLink).toHaveAttribute('href', '/edit/overdue1');
    });

    it('only has one class when both completed and overdue conditions are met', () => {
        const pastDate = new Date();
        pastDate.setDate(pastDate.getDate() - 10);
        const isoPastDate = pastDate.toISOString();

        const data = {
            _id: 'both1',
            todoDescription: 'Both Conditions',
            todoDateCreated: isoPastDate,
            todoCompleted: true,
        };

        wrap(<ToDoListItem data={data} />);

        const descCell = screen.getByText(/both conditions/i);
        expect(descCell).toBeInTheDocument();
        expect(descCell).toHaveClass('completed');
        expect(descCell).not.toHaveClass('overdue');
        
        const dateCell = screen.getByText(new RegExp(pastDate.toLocaleDateString('en-GB')));
        expect(dateCell).toBeInTheDocument();
        expect(dateCell).toHaveClass('completed');
        expect(dateCell).not.toHaveClass('overdue');
        
        const completedText = screen.getByText(/completed task/i);
        expect(completedText).toBeInTheDocument();
        
        const editLink = screen.queryByRole('link', { name: /edit/i });
        expect(editLink).toBeNull();

    });
});