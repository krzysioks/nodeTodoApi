const mongoose = require('mongoose');
//db model for user
const UserModel = mongoose.model('User', {
    user: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 1
    },
    age: {
        type: Number
    }
});

module.exports = {
    UserModel
};
