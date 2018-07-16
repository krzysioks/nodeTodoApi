const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email'
        }
    },
    password: {
        type: String,
        require: true,
        minlength: 6
    },
    tokens: [
        {
            access: {
                type: String,
                required: true
            },
            token: {
                type: String,
                required: true
            }
        }
    ]
});

UserSchema.methods.toJSON = function() {
    const userObject = this.toObject();
    return _.pick(userObject, ['_id', 'email']);
};

UserSchema.methods.generateAuthToken = function() {
    //this refers to doc stored in User db.
    const access = 'auth';
    const token = jwt.sign({ _id: this._id.toHexString(), access }, 'salt123').toString();

    this.tokens = [...this.tokens, { access, token }];

    return this.save().then(() => token);
};

//db model for user
const UserModel = mongoose.model('User', UserSchema);

module.exports = {
    UserModel
};
