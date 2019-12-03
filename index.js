// implement your API here
const express = require('express'); // import express

const db = require('./data/db.js'); // import database from the db file

const server = express(); 

server.use(express.json());

// CRUD

// Test if server works
server.get('/', (req, res) => {
    res.send({ api: 'up and running...'})
})

// Add a user
server.post('/api/users', (req, res) => {
    // get the data the client sent
    const userData = req.body;

    // call the db and add the user
    db.insert(userData)
    .then(user => {
        res.status(201).json(user);
    })
    .catch(err => {
        console.log('error on POST /api/users', err);
        res.status(500).json({ errorMessage: 'error adding a user to the database' })
    });
});

// Get a list of users
server.get('/api/users', (req, res) => {
    db.find().then(users => {
        res.status(200).json(users);
    })
    .catch(err => {
        console.log('error on GET /api/users', err);
        res.status(500).json({ errorMessage: 'error getting list of users from the database' })
    })
})

// Get a specific user
server.get('/api/users/:id', (req, res) => {
    const id = req.params.id;

    db.findById(id).then(user => {
        res.status(200).json(user);
    })
    .catch(err => {
        console.log('error on GET /api/user/:id', err);
        res.status(500).json({ errorMessage: 'error getting a specific user from the database' })
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
                message: 'user removed successfully', deletedUser
            })
            
        } else {
            res.status(404).json({
                message: 'user not found'
            })
        }
    })
    .catch(err => {
        console.log('error on DELETE /api/users/:id', err);
        res.status(500).json({ errorMessage: 'error removing the user' })
    });
})

// Edit a user
server.put('/api/users/:id', (req, res) => {
    // get the data the client sent
    const id = req.params.id;

    const userData = req.body;

    // call the db and add the user
    db.update(id, userData)
    .then(user => {
        db.find().then(users => {
            res.status(200).json(users);
        })
        // res.status(200).json(user);
    })
    .catch(err => {
        console.log('error on PUT /api/users/:id', err);
        res.status(500).json({ errorMessage: 'error updating a user in the database' })
    });
});



// Run server on a port

const port = 4000;
server.listen(port, () => console.log(`\n API running on port ${port} **\n`));