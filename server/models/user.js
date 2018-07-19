const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

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

UserSchema.statics.findByToken = function(token) {
    let decoded;

    try {
        decoded = jwt.verify(token, 'salt123');
    } catch (err) {
        return Promise.reject();
    }

    //return user which props match provided ones
    return this.findOne({
        _id: decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    });
};

UserSchema.statics.findByCredentials = function(email, password) {
    return this.findOne({ email })
        .then(user => {
            if (!user) {
                return Promise.reject({ error: 'User not found' });
            }

            return new Promise((resolve, reject) => {
                bcrypt.compare(password, user.password, (err, result) => {
                    if (result) {
                        resolve(user);
                    } else {
                        reject({ error: 'User not logged in' });
                    }
                });
            });
        })
        .catch(err => Promise.reject(err));
};

UserSchema.pre('save', function(next) {
    //check if password has been modified. Only then run middleware code.
    //we dont want to hash already hashed password
    if (this.isModified('password')) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(this.password, salt, (err, hash) => {
                this.password = hash;
                next();
            });
        });
    } else {
        next();
    }
});

//db model for user
const UserModel = mongoose.model('User', UserSchema);

module.exports = {
    UserModel
};
