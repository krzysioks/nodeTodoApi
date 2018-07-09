const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const { app } = require('./../server');
const { Todo } = require('./../models/todo.js');
//const { UserModel } = require('./models/user.js');

const todos = [
    {
        _id: new ObjectID(),
        text: 'Some todo 1'
    },
    {
        _id: new ObjectID(),
        text: 'Some todo 2'
    }
];

describe('POST/todos', () => {
    //preparation before running test. clearing database, so that assertion that after adding one document number of docs in db will be exactly 1.
    beforeEach(done => {
        Todo.remove({}).then(() => {
            Todo.insertMany(todos);
            return done();
        });
    });
    //since POST is a async action done argument is provided to make test assertion after request has been resolved
    it('should create new todo', done => {
        const text = 'This is the test todo text';

        request(app)
            .post('/todos')
            .send({ text })
            .expect(200)
            .expect(res => {
                expect(res.body.text).toBe(text);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.find({ text })
                    .then(todos => {
                        expect(todos.length).toBe(1);
                        expect(todos[0].text).toBe(text);
                        done();
                    })
                    .catch(err => done(err));
            });
    });

    it('it should not create todo wiith wrong body data', done => {
        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.find()
                    .then(todos => {
                        expect(todos.length).toBe(2);
                        done();
                    })
                    .catch(err => done(err));
            });
    });
});

describe('GET/todos', () => {
    it('should get all todos', done => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect(res => {
                expect(res.body.todos.length).toBe(2);
            })
            .end(done);
    });
});

describe('GET/todos/:id', () => {
    it('should return todo doc', done => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect(res => {
                expect(res.body.text).toBe(todos[0].text);
            })
            .end(done);
    });

    it('should return 404 if todo doc not found', done => {
        const fakeId = new ObjectID();
        request(app)
            .get(`/todos/${fakeId.toHexString()}`)
            .expect(404)
            .expect(res => {
                if (res.body.errMsg) {
                    expect(res.body.errMsg).toBe('Document not found');
                }
            })
            .end(done);
    });

    it('should return 404 if id is not valid id object', done => {
        const fakeId = 14587;
        request(app)
            .get(`/todos/${fakeId}`)
            .expect(res => {
                console.info(res.body);
                if (res.body.errMsg) {
                    expect(res.body.errMsg).toBe('Provided id is not valid');
                }
            })
            .end(done);
    });
});
