/*
Flow:
- Get all pets from the database
- Get a specific pet by ID from the database
- Post a new pet to the database
- Edit a pet by ID in the database
- Delete a pet by ID from the database
 */
const { mongo } = require("mongoose");
const petsModel = require("../config/db");
const _id = require("mongodb").ObjectId;

// Create an object of functions to deal with CRUD opertaions.
const petsController = {
  getAllPets: async (req, res) => {
    try {
      const pets = await petsModel.getCollection("pets").find().toArray();
      res.status(200).json(pets);
    } catch (error) {
      console.error("Error getting all pets:", error);
      res.status(500).json({ message: "Error getting all pets" });
    }
  },
  getSpecificPet: async (req, res) => {
    try {
      const pet = await petsModel
        .getCollection("pets")
        .findOne({ _id: new _id(req.params.id) });
      res.status(200).json(pet);
    } catch (error) {
      console.error("Error getting specific pet:", error);
      res.status(500).json({ message: "Error getting specific pet" });
    }
  },
  postNewPet: async (req, res) => {
    try {
      const {
        name,
        species,
        breed,
        age,
        gender,
        size,
        status,
        shelter_id,
        description,
        traits,
        intake_date,
      } = req.body;
      const addPet = await petsModel.getCollection("pets").insertOne({
        name,
        species,
        breed,
        age,
        gender,
        size,
        status,
        shelter_id,
        description,
        traits,
        intake_date,
      });
      res
        .status(201)
        .json({
          message: "New pet added successfully",
          petId: addPet.insertedId,
        });
    } catch (error) {
      console.error("Error posting new pet:", error);
      res.status(400).json({ message: "Error posting new pet" });
    }
  },

  editPet: async (req, res) => {
    try {
      const {
        name,
        species,
        breed,
        age,
        gender,
        size,
        status,
        shelter_id,
        description,
        traits,
        intake_date,
      } = req.body;
      const editPet = await petsModel
        .getCollection("pets")
        .updateOne(
          { id: new _id(req.params.id) },
          {
            $set: {
              name,
              species,
              breed,
              age,
              gender,
              size,
              status,
              shelter_id,
              description,
              traits,
              intake_date,
            },
          },
        );
      res.status(200).json({ message: "Pet edited successfully" });
    } catch (error) {
      console.error("Error editing pet:", error);
      res.status(400).message({ message: "Error editing pet" });
    }
  },

  deletePet: async (req, res) => {
    try {
      const deletePet = petsModel
        .getCollection("pets")
        .deleteOne({ id: new _id(req.params.id) });
      res.status(200).json({ message: "Pet deleted successfully" });
    } catch (error) {
      console.error("Error deleting pet:", error);
      res.status(400).json({ message: "Error deleting post" });
    }
  },
};

module.exports = petsController;
