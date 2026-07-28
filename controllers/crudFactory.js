const { ObjectId } = require("mongodb");
const mongodb = require("../db/connect");

function validId(id) {
  return ObjectId.isValid(id) && String(new ObjectId(id)) === id;
}

// GET ALL

function createCrudController(collectionName, singularName, fields) {
  const getAll = async (req, res, next) => {
    try {
      const documents = await mongodb
        .getDb()
        .collection(collectionName)
        .find({})
        .toArray();
      return res.status(200).json(documents);
    } catch (error) {
      return next(error);
    }
  };

// GET ONE BY ID

  const getOne = async (req, res, next) => {
    try {
      if (!validId(req.params.id)) {
        return res.status(400).json({ error: "Invalid ID" });
      }
      const document = await mongodb
        .getDb()
        .collection(collectionName)
        .findOne({ _id: new ObjectId(req.params.id) });
      if (!document) {
        return res.status(404).json({ error: `${singularName} not found` });
      }
      return res.status(200).json(document);
    } catch (error) {
      return next(error);
    }
  };

  // POST
  const create = async (req, res, next) => {
    try {
      const document = Object.fromEntries(
        fields
          .filter((field) => req.body[field] !== undefined)
          .map((field) => [field, req.body[field]])
      );
      const result = await mongodb
        .getDb()
        .collection(collectionName)
        .insertOne(document);
      return res
        .status(201)
        .location(`/${collectionName}/${result.insertedId}`)
        .json({ _id: result.insertedId, ...document });
    } catch (error) {
      return next(error);
    }
  };

  // PUT
  const update = async (req, res, next) => {
    try {
      if (!validId(req.params.id)) {
        return res.status(400).json({ error: "Invalid ID" });
      }
      const document = Object.fromEntries(
        fields
          .filter((field) => req.body[field] !== undefined)
          .map((field) => [field, req.body[field]])
      );
      const result = await mongodb
        .getDb()
        .collection(collectionName)
        .replaceOne({ _id: new ObjectId(req.params.id) }, document);
      if (result.matchedCount === 0) {
        return res.status(404).json({ error: `${singularName} not found` });
      }
      return res.status(204).send();
    } catch (error) {
      return next(error);
    }
  };

  // DELETE
  const remove = async (req, res, next) => {
    try {
      if (!validId(req.params.id)) {
        return res.status(400).json({ error: "Invalid ID" });
      }
      const result = await mongodb
        .getDb()
        .collection(collectionName)
        .deleteOne({ _id: new ObjectId(req.params.id) });
      if (result.deletedCount === 0) {
        return res.status(404).json({ error: `${singularName} not found` });
      }
      return res.status(204).send();
    } catch (error) {
      return next(error);
    }
  };

  return { getAll, getOne, create, update, remove };
}

module.exports = createCrudController;
