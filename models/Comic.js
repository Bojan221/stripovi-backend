const mongoose = require("mongoose")

const ComicSchema = new mongoose.Schema({ 
    title: { 
        type: String,
        required: true
    },
    issueNumber: { 
        type: String,
        required:true
    },
    coverImage: { 
        type: String,
        reuqired: true
    },
    edition: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "Edition",
        required:true
    }, 
    hero: { 
        type: mongoose.Schema.Types.ObjectId,
        ref:"Hero",
        required:true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    
},{timestamps:true})

const Comic = mongoose.model('Comic',ComicSchema);

module.exports = Comic;