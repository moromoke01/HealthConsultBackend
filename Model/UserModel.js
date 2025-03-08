const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fname: {
        type: String,
        required: true
    },
    lname: {
        type: String,
        required: true
    },
    contact: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'user'
    },
    verified: {
        type: Boolean,
        default: false
    }
});

// Custom toJSON method to exclude sensitive information
userSchema.methods.toJSON = function() {
    const user = this;
    const userObject = user.toObject();

    delete userObject.password; // Exclude password
    delete userObject.__v; // Exclude version key

    return userObject;
};

const User = mongoose.model('User', userSchema);

module.exports = User;