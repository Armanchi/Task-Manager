const mongoose = require('mongoose');

const MangaSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'must provide manga name'],
        trim: true,
        maxlength: [50, 'Title name can not exceed fifty characters'],
    },
    status:{
        type:String,
        enum:['completed', 'currently reading', 'want to read'],
        default: 'pending',
    },
      genre: {
        type: String,
        enum: ['Shounen', 'Shoujo', 'Josei', 'Seinen', 'Kodomo'],
        default: '', 
      },
      comments:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
      },
      yearCreated:{
        type: Number,
        maxlength: [4],
      },
      rating: {
        type: Number,
        default: 0,
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

    //comments
    const CommentSchema = new mongoose.Schema({
        text: String,
        rating: {
            type: Number,
            min: 1,
            max: 5,
            validate: {validator: Number.isInteger}
        },
    });



const manga = mongoose.model('manga', MangaSchema)
const comments = mongoose.model('comments', CommentSchema)

module.exports = {
  manga,
  comments,
}
