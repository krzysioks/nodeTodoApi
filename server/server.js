require('./config/config');
const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

const { mongoose } = require('./db/mongoose.js');
const { Todo } = require('./models/todo.js');
const { UserModel } = require('./models/user.js');
const { isValidId, findTodoById } = require('./../playground/mongooseQueries.js');
const { removeTodoById } = require('./../playground/mongooseDelete.js');
const { authenticate } = require('./middleware/middleware.js');

const app = express();

// //handling middleware (parsing post body got from client)
app.use(bodyParser.json());

app.post('/todos', authenticate, async (req, res) => {
    try {
        const todo = new Todo({
            text: req.body.text,
            creatorId: req.user._id
        });
        const doc = await todo.save();
        res.send(doc);
    } catch (err) {
        res.status(400).send(err);
    }
});

//handlig get request
app.get('/todos', authenticate, async (req, res) => {
    try {
        const todos = await Todo.find({ creatorId: req.user._id });
        res.send({ todos });
    } catch (err) {
        res.status(400).send(err);
    }
});

//GET /todos/123345
app.get('/todos/:id', authenticate, async (req, res) => {
    if (!isValidId(req.params.id)) {
        res.status(404).send({ errMsg: 'Provided id is not valid' });
        return;
    }

    const todo = await findTodoById(req.params.id, req.user._id);
    if (todo.errCode) {
        switch (todo.errCode) {
            case 400:
                res.status(400).send({ errMsg: 'Error occured while fetching doc from database' });
                break;
            case 404:
                res.status(404).send({ errMsg: 'Document not found' });
                break;
        }
    } else {
        res.status(200).send(todo);
    }
});

//DELETE /todos/123345
app.delete('/todos/:id', authenticate, async (req, res) => {
    if (!isValidId(req.params.id)) {
        res.status(404).send({ errMsg: 'Provided id is not valid' });
        return;
    }

    const todo = await removeTodoById(req.params.id, req.user._id);
    if (todo.errCode) {
        switch (todo.errCode) {
            case 400:
                res.status(400).send({ errMsg: 'Error occured while deleteing doc from database' });
                break;
            case 404:
                res.status(404).send({ errMsg: 'Document not found' });
                break;
        }
    } else {
        res.status(200).send({ todo });
    }
});

//PATCH /todos/123345
app.patch('/todos/:id', authenticate, async (req, res) => {
    try {
        //pick takes of req.body provided property names if they exist and create key value pair object
        const body = _.pick(req.body, ['text', 'completed']);

        if (!isValidId(req.params.id)) {
            res.status(404).send({ errMsg: 'Provided id is not valid' });
            return;
        }

        if (_.isBoolean(body.completed) && body.completed) {
            body.completedAt = new Date().getTime();
        } else {
            body.completed = false;
            body.completedAt = null;
        }

        const todo = await Todo.findOneAndUpdate(
            { _id: req.params.id, creatorId: req.user._id },
            { $set: body },
            { new: true }
        );
        if (!todo) {
            return res.status(404).send();
        }

        res.send({ todo });
    } catch (err) {
        res.status(400).send(err);
    }
});

app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
});

//POST user
app.post('/users/create', async (req, res) => {
    try {
        //pick takes of req.body provided property names if they exist and create key value pair object
        const body = _.pick(req.body, ['email', 'password']);
        const user = new UserModel(body);
        const response = await user.save();
        //since this is public route (adding user) -> authentication is not necessary.
        //here creating the auth token for newly added user
        const token = await response.generateAuthToken();
        res.header('x-auth', token).send(user);
    } catch (err) {
        res.status(400).send(err);
    }
});

//POST /users/login
app.post('/users/login', async (req, res) => {
    try {
        const body = _.pick(req.body, ['email', 'password']);
        const user = await UserModel.findByCredentials(body.email, body.password);
        const token = await user.generateAuthToken();
        //if user authenticated successfully -> generate token and add to x-auth header props
        res.header('x-auth', token).send(user);
    } catch (err) {
        res.status(400).send(err);
    }
});

//logg out user
app.delete('/users/me/token', authenticate, async (req, res) => {
    try {
        await req.user.removeToken(req.token);
        res.status(200).send();
    } catch (err) {
        res.status(400).send();
    }
});

//listen to the requests
app.listen(process.env.PORT, () => {
    console.info(`Server is on port ${process.env.PORT}`);
});

module.exports = {
    app
};
