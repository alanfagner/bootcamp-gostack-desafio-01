const express = require('express');

const server = express();

server.use(express.json());
server.use(incrementCount);
const projects = [];
let reqCount = 0;


function incrementCount(req, res, next) {
  reqCount++
  console.log(`Request number: ${reqCount}`);
  return next();
}

function checkProjectExist(req, res, next) {
  const { id } = req.params;
  const filterProjects = projects.find(project => project.id === id);

  if (!filterProjects) {
      return res.status(400).json({error: "Project not found"});
  }

  return next();
}


server.post(('/projects/:id/tasks'), checkProjectExist, (req, res) => {
  const { title } = req.body;
  const { id } = req.params;

  const project = projects.find(project => project.id === id);

  project.tasks.push(title);

  return res.json(projects);
});

server.delete('/projects/:id', checkProjectExist, (req, res) => {  
  const { id } = req.params;

  const index  = projects.findIndex(project => project.id ===id);

  projects.splice(index, 1);

  return res.send();
})

server.put('/projects/:id', checkProjectExist, (req, res) => {
  const { title } = req.body;
  const { id } = req.params;

  const project = projects.find(p => p.id == id);
  
  project.title = title;
  
  return res.json(projects);
})

server.get('/projects', (req, res) => {

  return res.json(projects);

})

server.post('/projects', (req, res) => {
  const { id, title } = req.body;

  projects.push({id, title, tasks: []});

  return res.json(projects); 
});

server.listen(3000);