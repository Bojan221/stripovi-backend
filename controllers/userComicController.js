const UserComic = require("../models/UserComic")

const addToCollection = async(req, res) => { 
    try { 
        const userId = req.user.id;
        const comicId = req.body.comic;

        const existingComic = await UserComic.findOne({user: userId, comic: comicId})

        if(existingComic) { 
            return res.status(409).json({message: "Strip vec postoji u kolekciji!"})
        }

        const userComic = await UserComic.create({
            user: userId,
            comic: comicId
        })
        
        if(userComic) { 
            return res.status(200).json({message: "Strip je uspjesno dodan!"})
        } else  { 
            return res.status(500).json({messasge:"Greska pri dodavanju stripa!"})
        }

    }catch(err) { 
        res.status(500).json({message:"Greska na serveru!"})
    }
}

module.exports = { 
    addToCollection
}