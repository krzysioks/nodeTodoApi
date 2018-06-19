const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect(
    'mongodb://localhost:27017/todoApp',
    (err, client) => {
        if (err) {
            console.log('Unable to connect to MongoDB server');
            return;
        }

        const db = client.db('todoApp');

        //updating document
        // db.collection('todos')
        //     .findOneAndUpdate(
        //         { _id: new ObjectID('5b23b5ee89ffee5fc7cb8c7f') },
        //         {
        //             $set: {
        //                 complete: true
        //             }
        //         },
        //         {
        //             returnOriginal: false
        //         }
        //     )
        //     .then(result => {
        //         console.log(`Result of find and update one: `, result);
        //     });

        db.collection('users')
            .findOneAndUpdate(
                { _id: new ObjectID('5b227b0ce363b43af8cc56d1') },
                {
                    $set: {
                        name: 'Krzysztof'
                    },
                    $inc: {
                        age: 5
                    }
                },
                {
                    returnOriginal: false
                }
            )
            .then(result => {
                console.log(`Result of find and update one: `, result);
            });

        console.log('Connected to MongoDB server');
        client.close();
    }
);
