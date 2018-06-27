const express = require('express');
const bodyParser = require('body-parser');

const { mongoose } = require('./db/mongoose.js');
const { Todo } = require('./models/todo.js');
const { UserModel } = require('./models/user.js');

const app = express();
const port = process.env.PORT || 3000;

//handling middleware (parsing post body got from client)
app.use(bodyParser.json());

app.post('/todos', (req, res) => {
    console.log(req.body);
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

//listen to the requests
app.listen(port, () => {
    console.info(`Server is on port ${port}`);
});
