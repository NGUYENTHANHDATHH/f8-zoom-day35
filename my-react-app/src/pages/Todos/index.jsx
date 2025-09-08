import React from "react";
function TodoList() {
    const [inputValue, setInputValue] = React.useState("");
    const [todos, setTodos] = React.useState([]);

    const handleInput = (e) => {
        setInputValue(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;
        setTodos([...todos, { id: Date.now(), text: inputValue, completed: false }]);
        setInputValue("");
    };

    const handleCheckbox = (id) => {
        setTodos(prev =>
            prev.map(todo =>
                todo.id === id ? { ...todo, completed: !todo.completed } : todo
            )
        );
    };

    const handleDelete = (id) => {
        setTodos(prev => prev.filter(todo => todo.id !== id));
    };

    // Tính toán từ state
    const tong = todos.length;
    const hoanThanh = todos.filter(t => t.completed).length;
    const conLai = tong - hoanThanh;

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={inputValue}
                    onChange={handleInput}
                    placeholder="Nhap task moi"
                />
                <button type="submit">Create</button>
                <p>Tổng: {tong}</p>
                <p>Hoàn thành: {hoanThanh}</p>
                <p>Còn lại: {conLai}</p>
            </form>

            <div>
                {todos.map((todo) => (
                    <div key={todo.id}>
                        <span style={{ textDecoration: todo.completed ? "line-through" : "none" }}>
                            {todo.text}
                        </span>
                        <input
                            type="checkbox"
                            checked={todo.completed}
                            onChange={() => handleCheckbox(todo.id)}
                        />
                        <button onClick={() => handleDelete(todo.id)}>Delete</button>
                    </div>
                ))}
            </div>
        </div>
    );
}
export default TodoList;