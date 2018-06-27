const mongoose = require('mongoose');

//set global Promise
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/todoApp');

module.exports = {
    mongoose
};
