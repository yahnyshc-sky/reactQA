import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import ToDoListItem from '../ToDoListItem/ToDoListItem';

function Table() {
    const [items, setItems] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/todo')
            .then(response => response.json())
            .then(data => setItems(data))
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    return (
        <div>
            <h2>Todos List</h2>
            <table className="table">
                <thead>
                    <tr>
                        <th>Description</th>
                        <th>Date Created</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map(item => (
                        <ToDoListItem key={item.id} data={item} />
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Table;
