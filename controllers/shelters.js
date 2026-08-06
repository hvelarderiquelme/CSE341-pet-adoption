const { ObjectId } = require("mongodb");
const { getCollection } = require("../config/db");

const collection = () => getCollection("shelters");

const getAll = async (req, res) => {
  try {
    const shelters = await collection().find().toArray();
    res.status(200).json(shelters);
  } catch (error) {
    res.status(500).json({ message: "Unable to retrieve shelters." });
  }
};

const getOne = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid shelter ID." });
    }

    const shelter = await collection().findOne({
      _id: new ObjectId(req.params.id)
    });

    if (!shelter) {
      return res.status(404).json({ message: "Shelter not found." });
    }

    return res.status(200).json(shelter);
  } catch (error) {
    return res.status(500).json({ message: "Unable to retrieve shelter." });
  }
};

const create = async (req, res) => {
  try {
    const result = await collection().insertOne(req.shelter);

    return res.status(201).json({
      message: "Shelter created.",
      id: result.insertedId
    });
  } catch (error) {
    return res.status(500).json({ message: "Unable to create shelter." });
  }
};

const update = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid shelter ID." });
    }

    const result = await collection().replaceOne(
      { _id: new ObjectId(req.params.id) },
      req.shelter
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Shelter not found." });
    }

    return res.status(200).json({
  message: "Shelter updated successfully."
});
  } catch (error) {
    return res.status(500).json({ message: "Unable to update shelter." });
  }
};

const remove = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid shelter ID." });
    }

    const result = await collection().deleteOne({
      _id: new ObjectId(req.params.id)
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Shelter not found." });
    }

    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ message: "Unable to delete shelter." });
  }
};

module.exports = { getAll, getOne, create, update, remove };