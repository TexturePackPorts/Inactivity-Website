const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { User, Admin } = require('./models');

const app = express();
app.use(express.json());

const MONGO_URI = process.env.MONGODB_URI;
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

app.post('/api/admin/login', async (req, res) => {
    const { password } = req.body;
    const admin = await Admin.findOne();

    if (!admin) {
        return res.status(404).send('Admin not found');
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
        return res.status(400).send('Invalid Credentials');
    }

    const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.send({ token });
})

app.post('/api/admin/users', async (req, res) => {
    const { name } = req.body;
    const user = new User({ name, inactivity_days: [] });
    await user.save();
    res.status(201).send(user);
});

app.post('/api/admin/users/:id/inactivity', async (req, res) => {
    const { id } = req.params;
    const { date, note } = req.body;

    const user = await User.findById(id);
    if (!user) {
        return res.status(404).send('User not found');
    }

    user.inactivity_days.push({ date, note });
    await user.save();

    res.send(user);
});

module.exports = app;