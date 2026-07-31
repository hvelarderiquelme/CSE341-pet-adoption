const express = require('express');
const { ObjectId } = require('mongodb');
const { getCollection } = require('../config/db');
const router = express.Router();

// Endpoint: Get. Get all records
router.get('/', async (req,res) => {
    try{
        //call the database
        const collection = getCollection('applications');
        //Find all documents and convert tem into a standard JavaScxript array
        const allApplications = await collection.find({}).toArray();
        res.json(allApplications);
    }catch(error){
        res.status(500).send('Error pulling data from the database');
    }
});

//Endpoint: GET. Get a specific record by id
router.get('/:id', async(req,res) => {
    const { id } = req.params;
    try{
        //calling the database
        const collection = getCollection('applications');

        //Find the specific record with a matching id
        const singleApplication = await collection.findOne({_id: new ObjectId(id)});
        if(!singleApplication){
            return res.status(404).send('Record not found');
        }

        res.json(singleApplication);

    }catch(error){
        res.status(500).send('Application ID is formatted incorrectly or does not exist')
    }
});

//Endpoint: POST. Create a new record
router.post('/', async(req,res) => { 
    try{
        //grab all the info
        const application = req.body;
        //call database
        const collection = getCollection('applications');
        //insert the data into a new row
        const result = await collection.insertOne(application);
        //returns the id of teh record
        return res.status(201).json({
            message: 'Record created successfully',
            id: result.insertedId
        });

    }catch(error){
        return res.status(500).json({
            error: 'Database saving failed.',
            details: error.message
        });
    }
});

//Endpoint: PUT. Update a record by id
router.put('/:id', async(req,res) => {
    //grab the id from the body
    const { id } = req.params;
    try{
        //call the database
        const collection = getCollection('applications');
        //update record
        const result = await collection.updateOne(
            {_id: new ObjectId(id)},
             {$set: req.body}   
            );
        //check if document was found
        if(result.matchedCount === 0){
            return res.status(404).json({error: 'Record not found'});
        }    
        //return success message
        return res.status(200).json({ message: 'Record created successfully.'});
    }catch(error){
        return res.status(500).json({error:'Database saving failed.', details: error.message});
    }
});

//Endpoint: DELETE. Delete a record by id
router.delete('/:id', async(req,res) => {
    const { id } = req.params;

    try{
        //call the database
        const collection = getCollection('applications');
        //delete record
        const result = await collection.deleteOne({_id: new ObjectId(id)});
        if(result.deletedCount === 0){
            res.status(400).json({error: 'record not found'});
        }
        return res.status(200).json({message: 'Record deleted successfully.'});

    }catch(error){
        return res.status(500).json({error: 'Database action failed', details: error.message});
    }
});

module.exports = router;