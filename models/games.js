const mongoose = require('mongoose');

const GameSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'must provide chore name'],
        trim: true,
        maxlength: [50, 'Game name can not exceed fifty characters'],
    },
    status:{
        type:String,
        enum:['completed', 'incomplete', 'pending'],
        default: 'pending',
    },
    system: {
        type: String,
        maxlength: [50],
      },
      genre: {
        type: String,
        enum: ['Action', 'RPG', 'Stratedgy', 'Simulation', 'Puzzle', 'Sports'],
        default: '', 
      },
      yearCreated:{
        type: Number,
        maxlength: [4],
      },
    createdBy:{
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required:[true, 'Please provide user']
    },
   
      createdDate: { 
        type: Date, 
        default: Date.now },
    });


    module.exports = mongoose.model('games', GameSchema)
