import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function EditPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [todo, setTodo] = useState({ description: "", created_at: "", completed: false });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`http://localhost:5000/todo/${id}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Todo not found");
                }
                return response.json();
            })
            .then((data) => {
                setTodo({
                    description: data.description || "",
                    created_at: data.created_at || "",
                    completed: data.completed || false,
                });
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching todo item:", error);
                setTodo({ description: "", created_at: "", completed: false });
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
        const update_todo = {
            description: todo["description"],
            completed: todo["completed"]
        }
        fetch(`http://localhost:5000/todo/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(update_todo),
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
                            name="description"
                            value={todo.description}
                            onChange={handleChange}
                            data-testid="description-input"
                            required
                        />
                    </div>

                    <p>Created on: {new Date(todo.created_at).toLocaleDateString('en-GB')}</p>

                    <div className="mb-3 d-flex align-items-center">
                        <label className="mb-0" htmlFor="completed">
                            Completed:
                        </label>
                        <input
                            className="ms-2"
                            type="checkbox"
                            id="completed"
                            name="completed"
                            checked={todo.completed}
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