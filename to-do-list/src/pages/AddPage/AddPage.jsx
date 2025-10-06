import React, { useState, useEffect } from 'react';
import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer';
import {useNavigate } from "react-router-dom";



const AddPage = () => {
    const [description, setDescription] = useState('');
    const [createdOn, setCreatedOn] = useState(new Date());
    const [completed, setCompleted] = useState(false);


    const navigate = useNavigate();

    useEffect(() => {
        setCreatedOn(new Date().toDateString());
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        const todo = {
            todoDescription: description,
            todoDateCreated: createdOn,
            todoCompleted: completed
        };
        fetch(`http://localhost:8000/todos/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(todo),
        })
            .then((response) => {
                if (response.ok) {
                    navigate("/");
                } else {
                    throw new Error("Failed to update todo");
                }
            })
            .catch((error) => console.error("Error updating todo:", error));

        setDescription('');
        setCompleted(false);
        setCreatedOn(new Date().toLocaleString());
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