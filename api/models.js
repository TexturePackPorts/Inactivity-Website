const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: String,
    inactivity_days: [
        {
            date: Date,
            note: String
        }
    ]
});

const AdminSchema = new mongoose.Schema({
    password: String
});

const User = mongoose.model('User', UserSchema);
const Admin = mongoose.model('Admin', AdminSchema);

module.exports = { User, Admin };