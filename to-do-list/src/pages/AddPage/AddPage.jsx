import React, { useState, useEffect } from 'react';
import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer';


const AddPage = () => {
    const [description, setDescription] = useState('');
    const [createdOn, setCreatedOn] = useState(new Date());
    const [completed, setCompleted] = useState(false);

    useEffect(() => {
        setCreatedOn(new Date());
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        const todo = {
            description,
            createdOn,
            completed,
        };

        console.log('Submitted todo:', todo);
        alert('Todo submitted — check the console for details');

        setDescription('');
        setCompleted(false);
        setCreatedOn(new Date().toLocaleString());
        window.location.replace('/');
    };

    return (
        <div className="AddPage">
            <Header />

            <main className="container my-4">
                <h2 className="mb-4">Add/Edit Todo</h2>

                <form onSubmit={handleSubmit} aria-label="add-todo-form">
                    <div className="mb-3">
                        <label className="form-label">Description:</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Todo description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            data-testid="description-input"
                        />
                    </div>

                    <p>Created on: {new Date(createdOn).toLocaleString()}</p>

                    <div className="mb-3 d-flex align-items-center">
                        <label className="mb-0" htmlFor="completed">
                            Completed:
                        </label>
                        <input
                            className="ms-2"
                            type="checkbox"
                            id="completed"
                            checked={completed}
                            onChange={(e) => setCompleted(e.target.checked)}
                            data-testid="completed-checkbox"
                            aria-label="completed-checkbox"
                        />
                    </div>

                    <button type="submit" className="btn btn-dark" data-testid="submit-btn">
                        Submit
                    </button>
                </form>
            </main>

            <Footer />
        </div>
    );
};

export default AddPage;