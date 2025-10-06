import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function EditPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [todo, setTodo] = useState({ todoDescription: "", todoDateCreated: "", todoCompleted: false });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`http://localhost:8000/todos/${id}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Todo not found");
                }
                return response.json();
            })
            .then((data) => {
                setTodo({
                    todoDescription: data.todoDescription || "",
                    todoDateCreated: data.todoDateCreated || "",
                    todoCompleted: data.todoCompleted || false,
                });
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching todo item:", error);
                setTodo({ todoDescription: "", todoCompleted: false });
                setLoading(false);
            });
    }, [id]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setTodo((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch(`http://localhost:8000/todos/${id}`, {
            method: "PATCH",
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
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="EditPage">
            <Header />

            <main className="container my-4">
                <h2 className="mb-4">Edit Todo</h2>

                <form onSubmit={handleSubmit} aria-label="add-todo-form">
                    <div className="mb-3">
                        <label className="form-label">Description:</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Todo description"
                            name="todoDescription"
                            value={todo.todoDescription}
                            onChange={handleChange}
                            data-testid="description-input"
                            required
                        />
                    </div>

                    <p>Created on: {new Date(Date.parse(todo.todoDateCreated)).toLocaleDateString('en-GB')}</p>

                    <div className="mb-3 d-flex align-items-center">
                        <label className="mb-0" htmlFor="completed">
                            Completed:
                        </label>
                        <input
                            className="ms-2"
                            type="checkbox"
                            id="completed"
                            name="todoCompleted"
                            checked={todo.todoCompleted}
                            onChange={handleChange}
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
}

export default EditPage;