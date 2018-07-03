const { mongoose } = require('./../server/db/mongoose');
const { UserModel } = require('./../server/models/user');
const { Todo } = require('./../server/models/todo');
const { ObjectID } = require('mongodb');
const _ = require('lodash');
const yargs = require('yargs');

//const id = '5b39e8c9055af72e64bd7ce0';
//const id = '5b39e8c9055af72e64bd7ce5a';
//const userId = '5b31f9276d496f2248c82b79';

const findById = function(id, collection) {
    const model = collection === 'UserModel' ? require('./../server/models/user') : require('./../server/models/todo');
    model[collection]
        .findById(id)
        .then(doc => {
            if (!doc) {
                return console.info(`Document not found in ${collection} collection`);
            }
            console.log('Document: ', doc);
        })
        .catch(err => console.log('Error: ', err));
};

const id = {
    describe: 'id of the document',
    demand: true,
    alias: 'id'
};

const collection = {
    describe: 'name of the collection: User or Todo',
    demand: true,
    alias: 'c'
};

const argv = yargs
    .command('findById', 'Find document by id in provided collection', {
        id,
        collection
    })
    .help().argv;
const command = argv._[0];

//console.info('Yargs:', argv);
if (command === 'findById') {
    findById(argv.id, argv.collection);
}

// if (!ObjectID.isValid(id)) {
//     console.log('ID not valid');
//     return;
// }

// Todo.find({
//     _id: id
// }).then(todos => {
//     console.log('Todos: ', todos);
// });

// Todo.findOne({
//     _id: id
// }).then(todo => {
//     console.log('Todo: ', todo);
// });

// Todo.findById(id)
//     .then(todo => {
//         if (!todo) {
//             return console.info('ID not found');
//         }
//         console.log('TodoById: ', todo);
//     })
//     .catch(err => console.log('Error: ', err));

// User.findById(userId)
//     .then(user => {
//         if (!user) {
//             return console.info('User not found');
//         }
//         console.log('TodoById: ', todo);
//     })
//     .catch(err => console.log('Error: ', err));
