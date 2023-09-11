const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

// Endpoint to todo as per Voraussetzung
app.get('/api/todos', (req, res) => {
  const todos = JSON.parse(fs.readFileSync('todos.json', 'utf-8'));
  const sortedTodos = todos.sort((a, b) => {
    if (a.completed === b.completed) {
      return 0;
    }
    if (a.completed) {
      return 1;
    }
    return -1;
  });
  res.json(sortedTodos);
});

// Endpoint to create a neu todo and adden into TODO.json
app.post('/api/todos', (req, res) => {
  const newTodo = req.body;
  const todos = JSON.parse(fs.readFileSync('todos.json', 'utf-8'));
  todos.push(newTodo);
  fs.writeFileSync('todos.json', JSON.stringify(todos, null, 2));
  res.json({ message: 'Todo created successfully.' });
});

// Endpoint to update a todo
app.put('/api/todos/:id', (req, res) => {
  const todoId = req.params.id;
  const updatedTodo = req.body;
  const todos = JSON.parse(fs.readFileSync('todos.json', 'utf-8'));
  const todoIndex = todos.findIndex(todo => todo.id === todoId);

  if (todoIndex !== -1) {
    todos[todoIndex] = updatedTodo;
    fs.writeFileSync('todos.json', JSON.stringify(todos, null, 2));
    res.json({ message: 'Todo updated successfully.' });
  } else {
    res.status(404).json({ message: 'Todo not found.' });
  }
});

// Endpoint to toggle the completion Zustand of a todo
app.put('/api/todos/:id/toggle', (req, res) => {
  const todoId = req.params.id;
  const todos = JSON.parse(fs.readFileSync('todos.json', 'utf-8'));
  const todo = todos.find(todo => todo.id === todoId);

  if (todo) {
    todo.completed = !todo.completed;
    fs.writeFileSync('todos.json', JSON.stringify(todos, null, 2));
    res.json({ message: 'Todo completion status toggled successfully.' });
  } else {
    res.status(404).json({ message: 'Todo not found.' });
  }
});

// Endpoint to delete a todo
app.delete('/api/todos/:id', (req, res) => {
  const todoId = req.params.id;
  const todos = JSON.parse(fs.readFileSync('todos.json', 'utf-8'));
  const updatedTodos = todos.filter(todo => todo.id !== todoId);

  if (todos.length !== updatedTodos.length) {
    fs.writeFileSync('todos.json', JSON.stringify(updatedTodos, null, 2));
    res.json({ message: 'Todo deleted successfully.' });
  } else {
    res.status(404).json({ message: 'Todo not found.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
