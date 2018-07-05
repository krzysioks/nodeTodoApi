const express = require('express');
const bodyParser = require('body-parser');

const { mongoose } = require('./db/mongoose.js');
const { Todo } = require('./models/todo.js');
const { UserModel } = require('./models/user.js');
const { isValidId, findTodoById } = require('./../playground/mongooseQueries.js');

const app = express();
const port = process.env.PORT || 3000;

// //handling middleware (parsing post body got from client)
app.use(bodyParser.json());

app.post('/todos', (req, res) => {
    //console.log(req.body);
    const todo = new Todo({
        text: req.body.text
    });
    todo.save().then(
        doc => {
            res.send(doc);
        },
        err => {
            res.status(400).send(err);
        }
    );
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

//listen to the requests
app.listen(port, () => {
    console.info(`Server is on port ${port}`);
});

module.exports = {
    app
};
