const Comic = require("../models/Comic");

const getAllComics = async(req,res) => { 
   try {

   } catch (err) { 
    res.status(500).json({message:err})
   } 
}


const getComicById = async(req,res) => { 
   try {

   } catch (err) { 
    res.status(500).json({message:err})
   } 
}

const createComic = async(req,res) => { 
   try {
    
    const {title, issueNumber, heroId, editionId} = req.body;
    const coverPicture = req.file;
    
    console.log(title, issueNumber,heroId,editionId, coverPicture)
    res.status(201).json({message: "Strip kreiran!", data: {title, issueNumber}});
   } catch (err) { 
    res.status(500).json({message: err.message})
   } 
}

const updateComic = async(req,res) => { 
   try {

   } catch (err) { 
    res.status(500).json({message:err})
   } 
}

const deleteComic = async(req,res) => { 
   try {

   } catch (err) { 
    res.status(500).json({message:err})
   } 
}

module.exports = { 
    getAllComics, 
    getComicById, 
    createComic, 
    updateComic, 
    deleteComic
}