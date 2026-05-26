const UserComic = require("../models/UserComic");
const mongoose = require("mongoose");

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

const getUserComics = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page, limit, hero, edition, publisher, search } = req.query;

    const currentPage = parseInt(page) || 1;
    const perPage = parseInt(limit) || 12;

    const comicFilter = {};

    if (hero && mongoose.Types.ObjectId.isValid(hero)) {
      comicFilter.hero = hero;
    }

    if (edition && mongoose.Types.ObjectId.isValid(edition)) {
      comicFilter.edition = edition;
    }

    if (search) {
      comicFilter.title = { $regex: search, $options: "i" };
    }

    if (publisher && mongoose.Types.ObjectId.isValid(publisher)) {
      const editions = await mongoose
        .model("Edition")
        .find({ publisher })
        .select("_id");
      const editionIds = editions.map((e) => e._id);
      comicFilter.edition = { $in: editionIds.length ? editionIds : [null] };
    }

    const matchingComicIds = Object.keys(comicFilter).length
      ? (await mongoose.model("Comic").find(comicFilter).select("_id")).map((c) => c._id)
      : null;

    const userComicFilter = { user: userId };
    if (matchingComicIds) {
      userComicFilter.comic = { $in: matchingComicIds };
    }

    const total = await UserComic.countDocuments(userComicFilter);
    const totalPages = Math.ceil(total / perPage);

    const userComics = await UserComic.find(userComicFilter)
      .populate({
        path: "comic",
        select: "-__v",
        populate: [
          { path: "createdBy", select: "firstName lastName email profilePicture" },
          {
            path: "edition",
            select: "name publisher",
            populate: { path: "publisher", select: "name" },
          },
          { path: "hero", select: "name alias" },
        ],
      })
      .limit(perPage)
      .skip((currentPage - 1) * perPage)
      .sort({ acquiredAt: -1 })
      .exec();

    return res.status(200).json({
      comics: userComics,
      totalComics: total,
      totalPages,
      currentPage,
    });
  } catch (err) {
    return res.status(500).json({ message: "Greska na serveru!" });
  }
};

module.exports = { 
    addToCollection,
    getUserComics
}