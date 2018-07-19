const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const { app } = require('./../server');
const { Todo } = require('./../models/todo.js');
//const { UserModel } = require('./models/user.js');

const todos = [
    {
        _id: new ObjectID(),
        text: 'Some todo 1',
        completed: false
    },
    {
        _id: new ObjectID(),
        text: 'Some todo 2',
        completed: true,
        completedAt: new Date().getTime() - 5000
    }
];

//preparation before running test. clearing database, so that assertion that after adding one document number of docs in db will be exactly 1.
beforeEach(done => {
    Todo.remove({}).then(() => {
        Todo.insertMany(todos);
        done();
    });
});

describe('POST/todos', () => {
    //since POST is a async action done argument is provided to make test assertion after request has been resolved
    it('should create new todo', done => {
        const text = 'This is the test todo text';
        request(app)
            .post('/todos')
            .send({ text })
            .expect(200)
            .expect(res => {
                expect(res.body.text).toBe(text);
                Todo.find({ text })
                    .then(todo => {
                        expect(todo.length).toBe(1);
                        expect(todo[0].text).toBe(text);
                    })
                    .catch(err => done(err));
            })
            .end(done);
    });
    it('it should not create todo with wrong body data', done => {
        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .expect(res => {
                Todo.find()
                    .then(todos => {
                        expect(todos.length).toBe(2);
                    })
                    .catch(err => done(err));
            })
            .end(done);
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
                if (res.body.errMsg) {
                    expect(res.body.errMsg).toBe('Provided id is not valid');
                }
            })
            .end(done);
    });
});

describe('DELETE /todos/:id', () => {
    it('should remove todo doc', done => {
        const hexId = todos[0]._id.toHexString();

        request(app)
            .delete(`/todos/${hexId}`)
            .expect(200)
            .expect(res => {
                expect(res.body.todo._id).toBe(hexId);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.findById(hexId)
                    .then(todo => {
                        expect(todo).toBe(null);
                        done();
                    })
                    .catch(err => done(err));
            });
    });

    it('should return 404 if todo not found', done => {
        const fakeId = new ObjectID();
        request(app)
            .delete(`/todos/${fakeId.toHexString()}`)
            .expect(404)
            .expect(res => {
                if (res.body.errMsg) {
                    expect(res.body.errMsg).toBe('Document not found');
                }
            })
            .end(done);
    });

    it('should return 404 if todo id object is invalid', done => {
        const fakeId = 14587;
        request(app)
            .delete(`/todos/${fakeId}`)
            .expect(res => {
                if (res.body.errMsg) {
                    expect(res.body.errMsg).toBe('Provided id is not valid');
                }
            })
            .end(done);
    });
});

describe('PATCH /todos/:id', () => {
    beforeEach(done => {
        Todo.remove({}).then(() => {
            Todo.insertMany(todos);
            return done();
        });
    });

    it('should update todo doc', done => {
        const hexId = todos[0]._id.toHexString();
        const body = {
            text: 'New test text',
            completed: true
        };

        request(app)
            .patch(`/todos/${hexId}`)
            .send(body)
            .expect(200)
            .expect(res => {
                expect(res.body.todo.text).toBe(body.text);
                expect(res.body.todo.completed).toBe(body.completed);
                expect(typeof res.body.todo.completedAt).toBe('number');
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                return done();
            });
    });

    it('should clear completedAt when todo is not completed', done => {
        const hexId = todos[1]._id.toHexString();
        const body = {
            text: 'Text of updated notCompleted property4',
            completed: false
        };

        request(app)
            .patch(`/todos/${hexId}`)
            .send(body)
            .expect(200)
            .expect(res => {
                expect(res.body.todo.text).toBe(body.text);
                expect(res.body.todo.completed).toBe(body.completed);
                expect(res.body.todo.completedAt).toBe(null);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                return done();
            });
    });
});
