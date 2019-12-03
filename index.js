// implement your API here
const express = require('express'); // import express

const db = require('./data/db.js'); // import database from the db file

const server = express(); 

server.use(express.json());

// CRUD

// Add a user
server.post('/api/users', (req, res) => {
    // get the data the client sent
    const userData = req.body;

    if (!userData.name || !userData.bio){
        res.status(400).json({ error: 'Please provide name and bio for the user.' })
    } else {
        // call the db and add the user
        db.insert(userData)
        .then(newUser => {
            db.findById(newUser.id).then(user => {
                res.status(201).json(user);
            })
        })
        .catch(err => {
            console.log('error on POST /api/users', err);
            res.status(500).json({ error: 'There was an error while saving the user to the database' })
        });
    }
});

// Get a list of users
server.get('/api/users', (req, res) => {
    db.find().then(users => {
        res.status(200).json(users);
    })
    .catch(err => {
        console.log('error on GET /api/users', err);
        res.status(500).json({ error: 'The users information could not be retrieved.' })
    })
})

// Get a specific user
server.get('/api/users/:id', (req, res) => {
    const id = req.params.id;

    db.findById(id).then(user => {
        if(user) {
            res.status(200).json(user);
        } 
        res.status(404).json({ error: 'The user with the specified ID does not exist.' })
    })
    .catch(err => {
        console.log('error on GET /api/user/:id', err);
        res.status(500).json({ error: 'The user information could not be retrieved.' })
    })
})

// Delete a user
server.delete('/api/users/:id', (req, res) => {
    const id = req.params.id;

    let deletedUser = {};

    db.findById(id).then(user => {
        deletedUser = user;
    })

    db.remove(id).then(removed => {
        if(removed) {
            res.status(200).json({
                message: 'User removed successfully', deletedUser
            })
            
        } else {
            res.status(404).json({
                message: 'The user with the specified ID does not exist.'
            })
        }
    })
    .catch(err => {
        console.log('error on DELETE /api/users/:id', err);
        res.status(500).json({ error: 'The user could not be removed.' })
    });
})

// Edit a user
server.put('/api/users/:id', (req, res) => {
    // get the data the client sent
    const id = req.params.id;

    const userData = req.body;

    if (!userData.name || !userData.bio){
        res.status(400).json({ error: 'Please provide name and bio for the user.' })
    }

    // call the db and add the user
    db.update(id, userData)
    .then(user => {
        // if user wasn't found
        if(!user) {
            res.status(404).json({ error: 'The user with the specified ID does not exist.' })
        }
        // if user was updated respond with list of users
        db.find().then(users => {
            res.status(200).json(users);
        })
    })
    .catch(err => {
        console.log('error on PUT /api/users/:id', err);
        res.status(500).json({ error: 'The user information could not be modified.' })
    });
});



// Run server on a port

const port = 4000;
server.listen(port, () => console.log(`\n API running on port ${port} **\n`));