require('./config/config');
const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');

const { mongoose } = require('./db/mongoose.js');
const { Todo } = require('./models/todo.js');
const { UserModel } = require('./models/user.js');
const { isValidId, findTodoById } = require('./../playground/mongooseQueries.js');
const { removeTodoById } = require('./../playground/mongooseDelete.js');
const { authenticate } = require('./middleware/middleware.js');

const app = express();

// //handling middleware (parsing post body got from client)
app.use(bodyParser.json());

app.post('/todos', (req, res) => {
    const todo = new Todo({
        text: req.body.text
    });
    todo.save()
        .then(doc => {
            res.send(doc);
        })
        .catch(err => {
            res.status(400).send(err);
        });
});

//handlig get request
app.get('/todos', (req, res) => {
    Todo.find().then(
        todos => {
            res.send({ todos });
        },
        err => {
            res.status(400).send(err);
        }
    );
});

//GET /todos/123345
app.get('/todos/:id', (req, res) => {
    if (!isValidId(req.params.id)) {
        res.status(404).send({ errMsg: 'Provided id is not valid' });
        return;
    }

    findTodoById(req.params.id).then(todo => {
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
});

//DELETE /todos/123345
app.delete('/todos/:id', (req, res) => {
    if (!isValidId(req.params.id)) {
        res.status(404).send({ errMsg: 'Provided id is not valid' });
        return;
    }

    removeTodoById(req.params.id).then(todo => {
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
});

//PATCH /todos/123345
app.patch('/todos/:id', (req, res) => {
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

    Todo.findByIdAndUpdate(req.params.id, { $set: body }, { new: true })
        .then(todo => {
            if (!todo) {
                return res.status(404).send();
            }

            res.send({ todo });
        })
        .catch(err => {
            res.status(400).send(err);
        });
});

app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
});

//POST user
app.post('/users/create', (req, res) => {
    //pick takes of req.body provided property names if they exist and create key value pair object
    const body = _.pick(req.body, ['email', 'password']);
    const user = new UserModel(body);

    user.save()
        .then(response => {
            //since this is public route (adding user) -> authentication is not necessary.
            //here creating the auth token for newly added user
            return response.generateAuthToken();
        })
        .then(token => {
            res.header('x-auth', token).send(user);
        })
        .catch(err => res.status(400).send(err));
});

//listen to the requests
app.listen(process.env.PORT, () => {
    console.info(`Server is on port ${process.env.PORT}`);
});

module.exports = {
    app
};
