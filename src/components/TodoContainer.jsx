import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TodoItem from './TodoItem';
import ButtonContainer from './ButtonContainer';
import './TodoContainer.css';

function TodoContainer({ theme, toggleTheme }) {
    const [todos, setTodos] = useState([]);
    const [editingTodo, setEditingTodo] = useState(null);
    const [newTitle, setNewTitle] = useState('');

    useEffect(() => {
        const fetchTodos = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/todos');
                setTodos(response.data);
            } catch (error) {
                console.error('Error fetching todos:', error);
            }
        };

        fetchTodos();
    }, []);

    const createTodo = async () => {
        try {
            await axios.post('http://localhost:8080/api/todos', { title: '새 할 일', completed: false });
            const response = await axios.get('http://localhost:8080/api/todos');
            setTodos(response.data);
        } catch (error) {
            console.error('Error creating todo:', error);
        }
    };

    return (
        <div className="todo-app-container">
            <ButtonContainer createTodo={createTodo} theme={theme} toggleTheme={toggleTheme} />
            <div className="todo-list">
                {todos.map(todo => (
                    <TodoItem 
                        key={todo.id}
                        todo={todo}
                        setTodos={setTodos}
                        editingTodo={editingTodo}
                        setEditingTodo={setEditingTodo}
                        newTitle={newTitle}
                        setNewTitle={setNewTitle}
                    />
                ))}
            </div>
        </div>
    );
}

export default TodoContainer;
