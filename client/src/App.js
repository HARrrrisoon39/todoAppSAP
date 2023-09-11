import React, { useState, useEffect } from 'react';
import PacmanLoader from "react-spinners/PacmanLoader";
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [editTodoId, setEditTodoId] = useState(null);
  const [updatedTodoText, setUpdatedTodoText] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    fetch('http://localhost:3001/api/todos')
      .then(response => response.json())
      .then(data => setTodos(data));
  }, [todos]);

  // Custom css for loader
  const override = `
      display: block;
      margin: 0 auto;
      border-color: red;
  `;
  // Custom css for center the div
  const divStyle = {
    centerDiv:{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
    },
    deleteButtonColor: {
      backgroundColor: "red",  
    },
    editButtonColor: {
      backgroundColor: "#ffc107",  
    }
  };

  const handleCreateTodo = () => {
    if (newTodo.trim() !== '') {
      const newTodoObject = { id: Date.now().toString(), text: newTodo, completed: false };
      fetch('http://localhost:3001/api/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTodoObject),
      })
        .then(response => response.json())
        .then(() => {
          setTodos([...todos, newTodoObject]);
          setNewTodo('');

          // Apply the new-item class to the latest todo item
          const newTodoIndex = todos.length;
          const todoListItems = document.querySelectorAll('li');
          todoListItems[newTodoIndex]?.classList.add('new-item');
        });
    }
  };

  const handleUpdateTodo = (id) => {
    if (updatedTodoText.trim() !== '') {
      const updatedTodoObject = { id, text: updatedTodoText };
      fetch(`http://localhost:3001/api/todos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTodoObject),
      })
        .then(response => response.json())
        .then(() => {
          const updatedTodos = todos.map(todo =>
            todo.id === id ? updatedTodoObject : todo
          );
          setTodos(updatedTodos);
          setEditTodoId(null);
          setUpdatedTodoText('');
        });
    }
  };

  const handleToggleTodo = (id, completed) => {
    const updatedTodoObject = { completed: !completed };
    fetch(`http://localhost:3001/api/todos/${id}/toggle`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedTodoObject),
    })
      .then(response => response.json())
      .then(() => {
        const updatedTodos = todos.map(todo =>
          todo.id === id ? { ...todo, completed: !completed } : todo
        );
        setTodos(updatedTodos);
      });
  };

  const handleDeleteTodo = (id) => {
    fetch(`http://localhost:3001/api/todos/${id}`, {
      method: 'DELETE',
    })
      .then(response => response.json())
      .then(() => {
        const updatedTodos = todos.filter(todo => todo.id !== id);
        setTodos(updatedTodos);
        // Apply the deleting class before removing the todo item
        const todoListItems = document.querySelectorAll('li');
        const deletingItem = todoListItems[todoListItems.length - 1]; // The item being deleted
        deletingItem.classList.add('deleting');
        setTimeout(() => {
          setTodos(updatedTodos); // Remove the todo item after animation
        }, 500); // Match the animation duration
      });
  };

  return (
    isLoading ? 
    <div style={divStyle.centerDiv}>
      <PacmanLoader color={'rgb(255, 193, 7)'} isLoading={isLoading} css={override} size={80} /> :
    </div>
    : 
    <div className="App">
      <h1 style={{color:'white'}}>TODO-APP</h1>
      <div className="todo-input-container">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Enter a new todo"
        />
        <button onClick={handleCreateTodo}>Add Todo</button>
      </div>
      <ul>
        {todos.map(todo => (
          <li key={todo.id} className="fade-in">
            {editTodoId === todo.id ? 
            <>
            </>
            :
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => handleToggleTodo(todo.id, todo.completed)}
            />
            }
            {editTodoId === todo.id ? (
              <>
                <input
                  type="text"
                  className="edit-input"
                  value={updatedTodoText}
                  onChange={(e) => setUpdatedTodoText(e.target.value)}
                />
                <button style={{ backgroundColor: 'green' }} onClick={() => handleUpdateTodo(todo.id)}>Update</button>
              </>
            ) : (
              <> 
                <span className={todo.completed ? 'completed' : ''}>{todo.text}</span>
                <button style={divStyle.editButtonColor} onClick={() => setEditTodoId(todo.id)}>Edit</button>
                <button style={divStyle.deleteButtonColor} onClick={() => handleDeleteTodo(todo.id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
