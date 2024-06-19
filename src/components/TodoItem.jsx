import React from 'react';
import axios from 'axios';
import './TodoItem.css';

const TodoItem = ({ todo, setTodos, editingTodo, setEditingTodo, newTitle, setNewTitle }) => {
    const updateTodo = async (id, completed) => {
        try {
            await axios.put(`http://localhost:8080/api/todos/${id}`, {
                completed: completed ? true : false,
                title: todo.title,
            });
            const response = await axios.get('http://localhost:8080/api/todos');
            setTodos(response.data);
        } catch (error) {
            console.error('Error updating todo:', error);
        }
    };

    const saveEdit = async (id) => {
        try {
            await axios.put(`http://localhost:8080/api/todos/${id}`, { title: newTitle, completed: todo.completed });
            const response = await axios.get('http://localhost:8080/api/todos');
            setTodos(response.data);
            setEditingTodo(null);
            setNewTitle('');
        } catch (error) {
            console.error('Error saving edit:', error);
        }
    };

    const deleteTodo = async (id) => {
        try {
            await axios.delete(`http://localhost:8080/api/todos/${id}`);
            const response = await axios.get('http://localhost:8080/api/todos');
            setTodos(response.data);
        } catch (error) {
            console.error('Error deleting todo:', error);
        }
    };

    const startEditing = (todo) => {
        setEditingTodo(todo.id);
        setNewTitle(todo.title || ''); // 초기값을 빈 문자열로 설정
    };

    return (
        <div className={`todo-item ${todo.completed ? 'completed' : ''}`} key={todo.id}>
            <input
                type="checkbox"
                checked={todo.completed ? true : false}
                onChange={() => updateTodo(todo.id, !todo.completed)}
            />
            {editingTodo === todo.id ? (
                <input type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
            ) : (
                <span>{todo.title ? todo.title : `할 일 #${todo.id}`}</span>
            )}
            {editingTodo === todo.id ? (
                <button className="save-btn" onClick={() => saveEdit(todo.id)}>
                    저장
                </button>
            ) : (
                <button className="edit-btn" onClick={() => startEditing(todo)}>
                    수정
                </button>
            )}
            <button className="delete-btn" onClick={() => deleteTodo(todo.id)}>
                삭제
            </button>
        </div>
    );
};

export default TodoItem;
