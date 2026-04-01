const mongoose = require("mongoose")

const ComicSchema = new mongoose.Schema({ 
    
},{timestamps:true})

const Comic = mongoose.model('Comic',ComicSchema);

module.exports = Comic;