const mongoose = require('mongoose');

//set global Promise
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/todoApp');

//create db model
//mongoose return js object with constructor which we can call by 'new'
const Todo = mongoose.model('Todo', {
    text: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    completedAt: {
        type: Number,
        default: null
    }
});

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

const addTodo = function(doc) {
    const todo = new Todo(doc);
    todo.save().then(
        () => {
            console.log(`Saved todo`, todo);
        },
        err => {
            console.log(`Unable to save todo: ${err}`);
        }
    );
};

const addUser = function(doc) {
    const user = new UserModel(doc);
    user.save().then(
        () => {
            console.log(`Saved user`, user);
        },
        err => {
            console.log(`Unable to save user: ${err}`);
        }
    );
};

addUser({
    user: 'Krzysztof',
    email: 'test@test.pl ',
    age: 33
});

// addTodo({
//     text: '   Watching football games today   ',
//     completed: true,
//     completedAt: 15323574
// });
