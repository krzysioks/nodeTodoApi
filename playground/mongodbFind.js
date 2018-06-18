const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect(
    'mongodb://localhost:27017/todoApp',
    (err, client) => {
        if (err) {
            console.log('Unable to connect to MongoDB server');
            return;
        }

        const db = client.db('todoApp');
        //fetching all documents from Todos collection (table)
        // db.collection('todos')
        //     .find({ _id: new ObjectID('5b22770cfedf630540bcfa62') })
        //     .toArray()
        //     .then(
        //         docs => {
        //             console.log(JSON.stringify(docs, undefined, 2));
        //         },
        //         err => {
        //             console.log('Unable to fetch todos', err);
        //         }
        //     );

        db.collection('users')
            .find({ name: 'Krzysztof' })
            .toArray()
            .then(
                docs => {
                    console.log(JSON.stringify(docs, undefined, 2));
                },
                err => {
                    console.log('Unable to fetch todos', err);
                }
            );

        db.collection('users')
            .find({ name: 'Krzysztof' })
            .count()
            .then(
                count => {
                    console.log(`Number of users with name "Krzysztof" is: ${count}`);
                    //console.log(JSON.stringify(docs, undefined, 2));
                },
                err => {
                    console.log('Unable to fetch todos', err);
                }
            );

        console.log('Connected to MongoDB server');
        client.close();
    }
);
