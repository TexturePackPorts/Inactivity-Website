const express = require('express');
const mongoose = require('mongoose');
const { User } = require('./models');

const app = express();
app.use(express.json());

const MONGO_URI = process.env.MONGODB_URI;
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

app.get('/api/users', async (req, res) => {
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    const users = await User.find();

    users.forEach(async user => {
        user.inactivity_days = user.inactivity_days.filter(day => new Date(day.date) >= threeMonthsAgo);
        await user.save();
    });

    res.send(users);
});

module.exports = app;