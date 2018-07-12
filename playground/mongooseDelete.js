const { mongoose } = require('./../server/db/mongoose');
const { UserModel } = require('./../server/models/user');
const { Todo } = require('./../server/models/todo');
const { ObjectID } = require('mongodb');

// Todo.remove({}).then(result => {
//     console.log(result);
// });

//Todo.findOneAndRemove()
// Todo.findByIdAndRemove('5b46043bfe985dd77c61b6ad').then(doc => {
//     console.log(doc);
// });

const removeTodoById = function(id) {
    return Todo.findByIdAndRemove(id)
        .then(doc => {
            if (!doc) {
                return { errCode: 404 };
            }
            return doc;
        })
        .catch(() => {
            return { errCode: 400 };
        });
};

module.exports = {
    removeTodoById
};
