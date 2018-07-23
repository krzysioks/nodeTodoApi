const mongoose = require('mongoose');

//create db model
//mongoose return js object with constructor which we can call by 'new'
const Todo = mongoose.model('Todo', {
    text: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    completedAt: {
        type: Number,
        default: null
    },
    creatorId: {
        require: true,
        type: mongoose.Schema.Types.ObjectId
    }
});

module.exports = {
    Todo
};
