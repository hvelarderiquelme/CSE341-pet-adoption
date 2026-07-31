/*
Flow:
- Get all applications from the database
- Get a specific application by ID from the database
- Post a new application to the database
- Edit an application by ID in the database
- Delete an application by ID from the database
 */
const applicationsModel = require('../config/db');
const _id = require('mongodb').ObjectId;

const applicationsController = {
    getAllApplications: async (req, res) => {
        try {
            const applications = await applicationsModel.getCollection('applications').find().toArray();
            res.status(200).json(applications);
        } catch (error) {
            console.error('Error getting all applications:', error);
            res.status(500).json({ message: 'Error getting all applications' });
        }
    },
    
    getSpecificApplication: async (req, res) => {
        try {
            const application = await applicationsModel.getCollection('applications').findOne({ _id: new _id(req.params.id) });
            if (!application) {
                return res.status(404).json({ message: 'Application not found' });
            }
            res.status(200).json(application);
        } catch (error) {
            console.error('Error getting specific application:', error);
            if (error.kind === 'ObjectId' || error.name === 'BSONError') {
                return res.status(400).json({ message: 'Invalid ID format' });
            }
            res.status(500).json({ message: 'Error getting specific application' });
        }
    },

    // postNewApplication: async (req, res) => {
    //     try {
    //         const { adopter_id, pet_id, shelter_id, status, application_date, notes } = req.body;
    //         const newApp = await applicationsModel.getCollection('applications').insertOne({
    //             adopter_id: new _id(adopter_id),
    //             pet_id: new _id(pet_id),
    //             shelter_id: new _id(shelter_id),
    //             status,
    //             application_date: new Date(application_date),
    //             notes
    //         });
    //         res.status(201).json({ message: 'New application submitted successfully', applicationId: newApp.insertedId });
    //     } catch (error) {
    //         console.error('Error posting new application:', error);
    //         if (error.name === 'BSONError') {
    //             return res.status(400).json({ message: 'Invalid ID format in payload' });
    //         }
    //         res.status(400).json({ message: 'Error posting new application' });
    //     }
    // },

    // new code to fix the silent error of not writing on the db
    postNewApplication: async (req, res) => {
    try {
        // 1. Destructure using 'submission_date' to match your data schema
        const { adopter_id, pet_id, shelter_id, status, submission_date, notes } = req.body;

        // 2. Proactive safety check: Make sure fields aren't blank before converting them
        if (!adopter_id || !pet_id || !shelter_id) {
            return res.status(400).json({ message: 'Missing required ID fields in request body' });
        try {
            const { adopter_id, pet_id, shelter_id, status, submission_date, notes } = req.body;
            const newApp = await applicationsModel.getCollection('applications').insertOne({
                adopter_id: new _id(adopter_id),
                pet_id: new _id(pet_id),
                shelter_id: new _id(shelter_id),
                status,
                submission_date: new Date(submission_date),
                notes
            });
            res.status(201).json({ message: 'New application submitted successfully', applicationId: newApp.insertedId });
        } catch (error) {
            console.error('Error posting new application:', error);
            if (error.name === 'BSONError') {
                return res.status(400).json({ message: 'Invalid ID format in payload' });
            }
            res.status(400).json({ message: 'Error posting new application' });
        }

        // 3. Perform the actual database write safely
        const newApp = await applicationsModel.getCollection('applications').insertOne({
            adopter_id: new _id(adopter_id),
            pet_id: new _id(pet_id),
            shelter_id: new _id(shelter_id),
            status: status || 'pending', // Fallback default if status is missing
            submission_date: submission_date ? new Date(submission_date) : new Date(), // Fallback to today's date
            notes: notes || ""
        });

        // 4. Return success response
        return res.status(201).json({ 
            message: 'New application submitted successfully', 
            applicationId: newApp.insertedId 
        });

    } catch (error) {
        // Detailed logging so you can see the exact line causing the issue in your console
        console.error('Error posting new application details:', error);
        
        if (error.name === 'BSONError' || error.message.includes('Argument passed in must be a string')) {
            return res.status(400).json({ message: 'Invalid 24-character hexadecimal ID format in payload' });
        }
        
        return res.status(500).json({ message: 'Internal Server Error posting new application' });
    }
},

    editApplication: async (req, res) => {
        try {
            const { adopter_id, pet_id, shelter_id, status, submission_date, notes } = req.body;
            
            const updateFields = {};
            if (adopter_id) updateFields.adopter_id = new _id(adopter_id);
            if (pet_id) updateFields.pet_id = new _id(pet_id);
            if (shelter_id) updateFields.shelter_id = new _id(shelter_id);
            if (status) updateFields.status = status;
            if (submission_date) updateFields.submission_date = new Date(submission_date);
            if (notes) updateFields.notes = notes;

            const editApp = await applicationsModel.getCollection('applications').updateOne(
                { _id: new _id(req.params.id) },
                { $set: updateFields }
            );

            if (editApp.matchedCount === 0) {
                return res.status(404).json({ message: 'Application not found' });
            }
            
            res.status(200).json({ message: 'Application updated successfully' });
        } catch (error) {
            console.error('Error editing application:', error);
            if (error.kind === 'ObjectId' || error.name === 'BSONError') {
                return res.status(400).json({ message: 'Invalid ID format' });
            }
            res.status(400).json({ message: 'Error editing application' });
        }
    },

    deleteApplication: async (req, res) => {
        try {
            const deleteApp = await applicationsModel.getCollection('applications').deleteOne({ _id: new _id(req.params.id) });
            if (deleteApp.deletedCount === 0) {
                return res.status(404).json({ message: 'Application not found' });
            }
            res.status(200).json({ message: 'Application deleted successfully' });
        } catch (error) {
            console.error('Error deleting application:', error);
            if (error.kind === 'ObjectId' || error.name === 'BSONError') {
                return res.status(400).json({ message: 'Invalid ID format' });
            }
            res.status(400).json({ message: 'Error deleting application' });
        }
    }
};

module.exports = applicationsController;
