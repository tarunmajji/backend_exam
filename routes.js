const express = require('express');
const router = express.Router();
const db = require('./db');

router.get('/users', (req, res) => {
    let users = db.getData();

    if (req.query.search) {
        const searchWord = req.query.search.toLowerCase();
        users = users.filter(user => {
            return user.name.toLowerCase().includes(searchWord) || 
                   user.email.toLowerCase().includes(searchWord);
        });
    }

    if (req.query.sort) {
        const sortBy = req.query.sort;
        const order = req.query.order;

        users.sort((a, b) => {
            let valA = a[sortBy];
            let valB = b[sortBy];

            if (valA < valB) return order === 'desc' ? 1 : -1;
            if (valA > valB) return order === 'desc' ? -1 : 1;
            return 0;
        });
    }

    res.json(users);
});

router.get('/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const users = db.getData();
    
    const foundUser = users.find(user => user.id === id);

    if (!foundUser) {
        return res.status(404).json({ message: "User not found" });
    }

    res.json(foundUser);
});

router.post('/users', (req, res) => {
    const name = req.body.name;
    const email = req.body.email;

    if (!name || !email) {
        return res.status(400).json({ message: "Name and Email are required!" });
    }

    const users = db.getData();

    const exists = users.find(u => u.email === email);
    if (exists) {
        return res.status(400).json({ message: "Email already taken" });
    }

    let newId = 1;
    if (users.length > 0) {
        const maxId = Math.max(...users.map(u => u.id));
        newId = maxId + 1;
    }

    const newUser = {
        id: newId,
        name: name,
        email: email
    };

    users.push(newUser);
    db.saveData(users);

    res.status(201).json(newUser);
});

router.put('/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const users = db.getData();
    
    const index = users.findIndex(u => u.id === id);

    if (index === -1) {
        return res.status(404).json({ message: "User not found" });
    }

    if (req.body.name) {
        users[index].name = req.body.name;
    }
    if (req.body.email) {
        users[index].email = req.body.email;
    }

    db.saveData(users);
    res.json(users[index]);
});

router.delete('/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    let users = db.getData();

    const originalLength = users.length;
    
    users = users.filter(u => u.id !== id);

    if (users.length === originalLength) {
        return res.status(404).json({ message: "User not found" });
    }

    db.saveData(users);
    res.send("User deleted successfully");
});

module.exports = router;