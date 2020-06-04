const express = require("express");
const db = require("./database");

const server = express();

server.use(express.json());

server.post("/api/users", (req, res) => {
  if (!req.body.name || !req.body.bio) {
    res
      .status(400)
      .json({ errorMessage: "Please provide name and bio for the user." });
  } else if (req.body.name && req.body.bio) {
    const newUser = db.createUser(req.body);
    res.status(201).json(newUser);
  } else {
    res
      .status(500)
      .json({
        errorMessage:
          "There was an error while saving the user to the database",
      });
  }
});

server.get("/api/users", (req, res) => {
  const users = db.getUsers();
  if(users){
    res.status(200).json(users);
  } else{
      res.status(500).json({errorMessage: "The users information could not be retrieved."})
  }
});

server.get("/api/users/:id", (req, res) => {
  const user = db.getUsersById(req.params.id);

  if (!user) {
    res
      .status(404)
      .json({ message: "The user with the specified ID does not exist." });
  } else if (user){
    res.status(302).json(user);
  } else {
    res.status(500).json({errorMessage: "The users information could not be retrieved."})
  }
});

server.delete("/api/users/:id", (req, res) => {
  const user = db.getUsersById(req.body.id);

  if (user) {
    const users = db.deleteUser(user.id);
    res.status(200).json(users);
  } else if (!user) {
    res
      .status(404)
      .json({ message: "The user with the specified ID does not exist." });
  } else {
    res.status(500).json({ errorMessage: "The user could not be removed" });
  }
});

server.put("/api/users/:id", (req, res) => {
  const user = db.getUsersById(req.body.id);
  if (!user) {
    res
      .status(404)
      .json({ message: "The user with the specified ID does not exist." });
  } else if (!user.name || !user.bio) {
    res
      .status(400)
      .json({ errorMessage: "Please provide a name and bio for the user" });
  } else if (user.name && user.bio) {
    const newUser = {
      id: req.body.id,
      name: req.body.name,
      bio: req.body.bio,
    };
    res.status(200).json(newUser);
  } else {
    res
      .status(500)
      .json({ errorMessage: "The user information could not be modified." });
  }
});

server.listen(8080, ()=>{
    console.log("server started on port 8080")
})