const { UserModel } = require('./../models/user');

//this is the middleware function
//next prop is used to indicate middleware to execute the route after all midddleware actions are processed
const authenticate = (req, res, next) => {
    const token = req.header('x-auth');
    UserModel.findByToken(token)
        .then(user => {
            if (!user) {
                return Promise.reject();
            }

            req.user = user;
            req.token = token;
            next();
        })
        .catch(err => {
            res.status(401).send({});
        });
};

module.exports = {
    authenticate
};
