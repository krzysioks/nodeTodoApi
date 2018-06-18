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
        // db.collection('todos').insertOne(
        //     {
        //         text: 'Something to do',
        //         completed: false
        //     },
        //     (err, result) => {
        //         if (err) {
        //             console.log('Unable to insert todo', err);
        //             return;
        //         }

        //         console.log(JSON.stringify(result.ops, undefined, 2));
        //     }
        // );

        // db.collection('users').insertOne(
        //     {
        //         name: 'Krzysztof',
        //         age: 33,
        //         location: 'Gdynia'
        //     },
        //     (err, result) => {
        //         if (err) {
        //             console.log('Unable to insert todo', err);
        //             return;
        //         }

        //         console.log(result.ops[0]._id.getTimestamp());
        //     }
        // );

        console.log('Connected to MongoDB server');
        client.close();
    }
);
