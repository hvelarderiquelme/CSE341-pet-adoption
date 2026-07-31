const express = require('express');
const { ObjectId } = require('mongodb');
const{ getCollection } = require('../config/db');
const router = express.Router();
//const { requireAuth } = require('../middleware/requireAuth');
//const { bookValidationRules } = require('../middleware/bookValidationRules');
//const { validatePayload } = require('../middleware/validate');

/*****************************************************************
 * ********************   GET ROUTES   ***************************
******************************************************************/
//Endpoint: Get all pets
router.get('/', async(req,res) => {
    try{
        //for my pets collection
        const collection = getCollection('pets');
        //Find all documents and convert them into a standard JavaScript array
        const allpets = await collection.find({}).toArray();
        res.json(allpets);
    }catch(error){
        res.status(500).send("Error pulling data from the database.");
    }
    
});

// Endpoint: GET ONE single contact by its unique ID. 
// Type http://localhost:8080/books/{any id from the database}

router.get('/:id', async (req, res) => {
    try {
        const collection = getCollection('pets');
        
        // Convert the text ID string from the URL into a real MongoDB Object ID
        const petId = new ObjectId(req.params.id);
        
        // Search the database for the matching unique _id record
        const singlePet = await collection.findOne({ _id: petId });
        
        if (!singlePet) {
            return res.status(404).send("Pet not found.");
        }
        
        res.json(singlePet);
    } catch (error) {
        res.status(500).send("Pet ID is formatted incorrectly or does not exist.");
    }
});

//End point POST: Create a new pet document in the collection
router.post('/', async(req,res) => {
    try{
        //calls the pets collection
        const petsCollection = getCollection('pets');
        //inserts the new document in the MongoDB collection after validation
        const result = await petsCollection.insertOne(req.body);
        //returns the id of the new document
        return res.status(201).json({
            message:'New pet record created',
            id: result.insertedId
        });
    }catch(error){
        return res.status(500).json({
            error: 'Database saving failed', 
            details: error.message});
    }
});

//Endpoint: PUT. Update an existing record
router.put('/:id', async(req,res) => {
    const {id} = req.params;
    try{
        //call the collection
        const petsCollection = getCollection('pets');
        //updates the record
        const result = await petsCollection.updateOne(
            {_id: new ObjectId(id)},
            {$set: req.body}
        );
        //check if the document was found
        if(result.matchedCount === 0){
            return res.status(404).json({error: 'Record not found'});
        }    
        return res.status(200).json({message: 'Record updated successfully.'});
    }catch(error){
        return res.status(500).json({error: 'Database saving failed', details: error.message});
    }
});

//Endpoint: DELETE. Delete a record from the database
router.delete('/:id', async(req,res) => {
    const { id } = req.params;
    try{
        //call the database
        const petCollection = getCollection('pets');
        //delete record
        const result = await petCollection.deleteOne(
            {_id: new ObjectId(id)}    
        );
        //checkif document was found
        if(result.deletedCount === 0){
            return res.status(404).json({ error: 'Record not found.'})
        }
        //return a success message
        return res.status(200).json({message: 'Record deleted successfully'});
    }catch(error){
        return res.status(500).json({
            error: 'Database failed',
            details: error.message});
    }
});

module.exports = router;