const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {

  const { username } = request.headers;

  const user = users.find(u => u.username === username);
  if (!user)
    return response.status(404).json({ error: "User not found!" });

  request.user = user;
  return next();
}

app.get('/', (request, response) => {
  return response.json("I'm listening!");
});

app.post('/users', (request, response) => {

  const { name, username } = request.body;

  const userDb = users.find(u => u.username === username);
  if (userDb)
    return response.status(400).json({ error: "Username already exists!" }).send();

  const user = {
    id: uuidv4(),
    name: name,
    username: username,
    todos: []
  }
  users.push(user);
  return response.status(201).json(user);
});

app.get('/users', (request, response) => {
  return response.json(users);
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  return response.json(user.todos);
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { title, deadline } = request.body;

  const todo = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date()
  }
  user.todos.push(todo);
  return response.status(201).json(todo);
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {

  const { user } = request;
  const id = request.params.id;
  const { title, deadline } = request.body;

  const todo = user.todos.find(t => t.id === id);
  if (!todo)
    return response.status(404).json({ error: "Todo not found." });

  if (title)
    todo.title = title;

  if (deadline)
    todo.deadline = deadline;

  return response.json(todo);
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {

  const { user } = request;
  const id = request.params.id;

  let todo = user.todos.find(t => t.id === id);

  if (!todo)
    return response.status(404).json({ error: "Todo not found." });

  todo.done = true;

  return response.status(200).json(todo);
});

app.delete('/todos/:id/', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const id = request.params.id;

  if (!user.todos.find(t => t.id === id))
    return response.status(404).json({ error: "Todo not found." });

  user.todos  = user.todos.filter(t => t.id !== id);

  return response.status(204).send();
});

module.exports = app;