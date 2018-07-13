const mongoose = require('mongoose');

//set global Promise
mongoose.Promise = global.Promise;
//mongodb://<dbuser>:<dbpassword>@ds131711.mlab.com:31711/nodetodoapp
mongoose.connect(process.env.MONGODB_URI);

module.exports = {
    mongoose
};
