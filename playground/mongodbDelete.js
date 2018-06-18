//const MongoClient = require('mongodb').MongoClient;
const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect(
    'mongodb://localhost:27017/todoApp',
    (err, client) => {
        if (err) {
            console.log('Unable to connect to MongoDB server');
            return;
        }

        const db = client.db('todoApp');

        //delete many
        // db.collection('todos')
        //     .deleteMany({ text: 'Write a code' })
        //     .then(result => {
        //         console.log(result);
        //     });

        //delete One
        // db.collection('todos')
        //     .deleteOne({ text: 'Write a code' })
        //     .then(result => {
        //         console.log(result);
        //     });

        //findOneAndDelete
        // db.collection('todos')
        //     .findOneAndDelete({ completed: false })
        //     .then(result => {
        //         console.log(result);
        //     });

        //delete duplicate users and find and delete one by id
        db.collection('users')
            .deleteMany({ name: 'Krzysztof' })
            .then(result => {
                console.log(`Result of deleteing many: ${result}`);
            });

        db.collection('users')
            .findOneAndDelete({ _id: new ObjectID('5b227afa44ddf93704de328e') })
            .then(result => {
                console.log(`Result of find and delete one: ${result}`);
            });
        console.log('Connected to MongoDB server');
        client.close();
    }
);
