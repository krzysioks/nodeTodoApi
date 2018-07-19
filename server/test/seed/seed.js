const { ObjectID } = require('mongodb');
const { Todo } = require('./../../models/todo.js');
const { UserModel } = require('./../../models/user.js');
const jwt = require('jsonwebtoken');

const todos = [
    {
        _id: new ObjectID(),
        text: 'Some todo 1',
        completed: false
    },
    {
        _id: new ObjectID(),
        text: 'Some todo 2',
        completed: true,
        completedAt: new Date().getTime() - 5000
    }
];

const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const salt = 'salt123';

const users = [
    {
        _id: userOneId,
        email: 'testkp@test.pl',
        password: 'userPasswd123',
        tokens: [
            {
                access: 'auth',
                token: jwt.sign({ _id: userOneId, access: 'auth' }, salt).toString()
            }
        ]
    },
    {
        _id: userTwoId,
        email: 'testkp2@test.pl',
        password: 'uPasswd123'
    }
];

//preparation before running test. clearing database, so that assertion that after adding one document number of docs in db will be exactly 1.
const populateTodos = done => {
    Todo.remove({}).then(() => {
        Todo.insertMany(todos);
        done();
    });
};

const populateUsers = done => {
    UserModel.remove({}).then(() => {
        Promise.all([new UserModel(users[0]).save(), new UserModel(users[1]).save()]);
        done();
    });
};

module.exports = { todos, populateTodos, users, populateUsers };
