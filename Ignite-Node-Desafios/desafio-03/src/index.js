const express = require("express");

const { v4: uuid } = require("uuid");

const app = express();

app.use(express.json());

const repositories = [];

function checkRepositoryExists(request, response, next) {
  const { id } = request.params;
  
  const repository = repositories.find(repository => repository.id === id);

  if (!repository) {
    return response.status(404).json({ error: "Repository not found" });
  }

  request.repository = repository;

  return next();
}

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };

  repositories.push(repository);

  return response.status(201).json(repository);
});

app.put("/repositories/:id", checkRepositoryExists, (request, response) => {
  const { url, title, techs } = request.body;
  const { repository } = request;

  repository.title = title;
  repository.url = url;
  repository.techs = techs;

  return response.status(201).json(repository);
});

app.delete("/repositories/:id", checkRepositoryExists, (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", checkRepositoryExists, (request, response) => {
  const { id } = request.params;
  const { repository } = request;

  repository.likes += 1;

  return response.json(repository);
});

module.exports = app;
