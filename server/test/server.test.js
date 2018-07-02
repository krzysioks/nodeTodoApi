const expect = require('expect');
const request = require('supertest');

const { app } = require('./../server');
const { Todo } = require('./../models/todo.js');
//const { UserModel } = require('./models/user.js');

const todos = [
    {
        text: 'Some todo 1'
    },
    {
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
