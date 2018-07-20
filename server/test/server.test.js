const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const { app } = require('./../server');
const { Todo } = require('./../models/todo.js');
const { todos, populateTodos, users, populateUsers } = require('./seed/seed');
const { UserModel } = require('./../models/user.js');

//preparation before running test. clearing database, so that assertion that after adding one document number of docs in db will be exactly 1.
beforeEach(populateTodos);
beforeEach(populateUsers);

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

describe('GET /users/me', () => {
    it('should return user if authenticated', done => {
        //when GET request is called -> set is setting the header props
        //setting x-auth header props with token of the first user stored in users list
        request(app)
            .get('/users/me')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect(res => {
                expect(res.body._id).toBe(users[0]._id.toHexString());
                expect(res.body.email).toBe(users[0].email);
            })
            .end(done);
    });

    it('should return 401 if not authenticated', done => {
        request(app)
            .get('/users/me')
            .set('x-auth', '')
            .expect(401)
            .expect(res => {
                expect(res.body).toEqual({});
            })
            .end(done);
    });
});

describe('POST /users/create', () => {
    it('should create user', done => {
        const email = 'user_test@test.pl';
        const password = 'passwd123!';

        request(app)
            .post('/users/create')
            .send({ email, password })
            .expect(200)
            .expect(res => {
                expect(res.headers['x-auth']).toExist();
                expect(res.body._id).toExist();
                expect(res.body.email).toBe(email);
            })
            .end(err => {
                if (err) {
                    return done();
                }

                UserModel.findOne({ email })
                    .then(user => {
                        expect(user).toExist();
                        //after creating user, stored password should be hashed
                        expect(user.password).toNotBe(password);
                        done();
                    })
                    .catch(err => done(err));
            });
    });

    it('should validation errors if request invalid', done => {
        const email = 'user_test.pl';
        const password = 'pa';
        request(app)
            .post('/users/create')
            .send({ email, password })
            .expect(400)
            .expect(res => {
                expect(res.body.errors.email.name).toBe('ValidatorError');
                expect(res.body.errors.password.name).toBe('ValidatorError');
            })
            .end(done);
    });

    it('should not create user if email in use', done => {
        const password = 'passwd123!';

        request(app)
            .post('/users/create')
            .send({ email: users[0].email, password })
            .expect(400)
            .expect(res => {
                expect(res.body.name).toBe('MongoError');
            })
            .end(done);
    });
});

describe('POST /users/login', () => {
    it('should login user and return auth token', done => {
        request(app)
            .post('/users/login')
            .send({
                email: users[1].email,
                password: users[1].password
            })
            .expect(200)
            .expect(res => {
                expect(res.headers['x-auth']).toBeTruthy();
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                UserModel.findById(users[1]._id)
                    .then(user => {
                        expect(user.tokens[0]).toMatchObject({
                            access: 'auth',
                            token: res.headers['x-auth']
                        });
                        done();
                    })
                    .catch(err => done(err));
            });
    });
    it('should reject invalid login (no user)', done => {
        const email = 'user_test@test.pl';
        const password = 'passwd123!';
        request(app)
            .post('/users/login')
            .send({
                email,
                password
            })
            .expect(400)
            .expect(res => {
                expect(res.headers['x-auth']).not.toBeTruthy();
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                expect(res.body.error).toBe('User not found');
                done();
            });
    });

    it('should reject invalid login (invalid password)', done => {
        const email = users[1].email;
        const password = 'passwd123!';
        request(app)
            .post('/users/login')
            .send({
                email,
                password
            })
            .expect(400)
            .expect(res => {
                expect(res.headers['x-auth']).not.toBeTruthy();
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                UserModel.findById(users[1]._id)
                    .then(user => {
                        expect(user.tokens.length).toBe(0);
                        expect(res.body.error).toBe('User not logged in');
                        done();
                    })
                    .catch(err => done(err));
            });
    });
});
