/*
Flow:
- Get all adopters from the database
- Get a specific adopter by ID from the database
- Post a new adopter to the database
- Edit an adopter by ID in the database
- Delete an adopter by ID from the database
 */
const { mongo } = require('mongoose');
const adoptersModel = require('../config/db');
const _id = require('mongodb').ObjectId;



// Create an object of functions to deal with CRUD opertaions.
const adoptersController = {
    getAlladopters: async (req, res) => {
        try {
            const adopters = await adoptersModel.getCollection('adopters').find().toArray();
            res.status(200).json(adopters);
        }
        catch (error) {
            console.error('Error getting all adopters:', error);
            res.status(500).json({ message: 'Error getting all adopters' });
        }
    },
    getSpecificAdopter: async (req, res) => {
        try {
            const adopter = await adoptersModel.getCollection('adopters').findOne({ _id: new _id(req.params.id) });
            res.status(200).json(adopter);
        }
        catch (error) {
            console.error('Error getting specific adopter:', error);
            res.status(500).json({ message: 'Error getting specific adopter' });
        }
    },
    postNewAdopter: async (req, res) => {
        try {
            const { first_name, last_name, email, phone, location, preferences, household_info } = req.body;
            const addAdopter = await adoptersModel.getCollection('adopters').insertOne({
                first_name,
                last_name,
                email,
                phone,
                location,
                preferences,
                household_info
            });
            res.status(201).json({ message: 'New adopter added successfully', adopterId: addAdopter.insertedId });
        }
        catch (error) {
            console.error('Error posting new adopter:', error);
            res.status(400).json({ message: 'Error posting new adopter' });
        }
    },

    editAdopter: async (req, res) => {
        try {
            const { first_name, last_name, email, phone, location, preferences, household_info } = req.body;
            const editAdopter = await adoptersModel.getCollection('adopters').updateOne({ _id: new _id(req.params.id) }, { $set: { first_name, last_name, email, phone, location, preferences, household_info } });
            res.status(200).json({ message: 'Adopter edited successfully' });

        } catch (error) {
            console.error('Error editing adopter:', error);
            res.status(400).json({ message: 'Error editing adopter' });
        }
    },

    deleteAdopter: async (req, res) => {
        try {
            const deleteAdopter = await adoptersModel.getCollection('adopters').deleteOne({ _id: new _id(req.params.id) });
            res.status(200).json({ message: 'Adopter deleted successfully' });

        } catch (error) {
            console.error('Error deleting adopter:', error);
            res.status(400).json({ message: 'Error deleting adopter' });
        }
    }

};


module.exports = adoptersController;