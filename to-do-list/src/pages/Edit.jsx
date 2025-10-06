import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Edit() {
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
        <div className="Edit" >
            <Header />
            <h2>Edit Todo</h2>
            <form onSubmit={handleSubmit} style={{ width: "100%", maxWidth: "400px" }}>
                <div style={{ marginBottom: "1rem" }}>
                    <label>Description:</label>
                    <input
                        type="text"
                        name="todoDescription"
                        value={todo.todoDescription}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div style={{ marginBottom: "1rem" }}>
                    <label >Created At:</label>
                    <span>{new Date(Date.parse(todo.todoDateCreated)).toLocaleDateString('en-GB')}</span>
                </div>
                <div style={{ marginBottom: "1rem" }}>
                    <label>
                        Completed:
                        <input
                            type="checkbox"
                            name="todoCompleted"
                            checked={todo.todoCompleted}
                            onChange={handleChange}
                        />
                    </label>
                </div>
                <button type="submit">Save</button>
            </form>
            <Footer />
        </div>
    );
}

export default Edit;