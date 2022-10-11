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
        type: String,
        trim: true,
        maxlength: [150, "comments cannot acceed 150 characters"],
      },
      yearCreated:{
        type: Number,
        maxlength: [4],
      },
      rating: {
        type: Number,
        default: 0,
      },
      comments: {
        type: String,
        trim: true,
        maxlength: [150, "comments cannot exceed 150 characters"],
      },
    createdBy:{
      type: String,
      required: [true, "Please login first"],
    },
   
      createdDate: { 
        type: Date, 
        default: Date.now },
    });



module.exports = mongoose.model("Manga", MangaSchema);

