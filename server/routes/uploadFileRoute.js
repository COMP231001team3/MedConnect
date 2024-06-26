//Iuliia Chugunova
//API endpoints to upload and download a file

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path'); // Import path module
const fs = require('fs'); // Import fs module
const Patient = require('../models/patient.model');

// Define multer storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '..', 'uploads')); // Set destination folder
    },
    filename: function (req, file, cb) {
        let extArray = file.originalname.split(".");
        let extension = extArray[extArray.length - 1];
        cb(null, file.fieldname + '-' + Date.now() + '.' + extension);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 } // Limit file size to 5MB
});

// POST route for uploading files
router.post('/upload', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // Extract necessary information from the request
        const { filename, originalname } = req.file;
        const patientId = req.body.patientId;

        // Update patient's document array with the new file information
        const updatedPatient = await Patient.findByIdAndUpdate(patientId, {
            $push: {
                documents: {
                    type: 'Uploaded File',
                    filename: filename,
                    originalname: originalname,
                    uploadedAt: new Date()
                }
            },
            new: true
        });

        if (!updatedPatient) {
            return res.status(404).json({ error: 'Patient not found' });
        }

        // File information saved to patient's documents array successfully
        res.status(201).json({ message: 'File uploaded and saved to patient profile successfully', filename: filename });
    } catch (error) {
        console.error('Error uploading file:', error);
        res.status(500).json({ error: 'An error occurred while uploading file' });
    }
});

// GET route for downloading files
router.get('/download/:patientId/:filename', async (req, res) => {
    try {
        const { patientId, filename } = req.params;

        // Find the patient by ID
        const patient = await Patient.findById(patientId);
        if (!patient) {
            return res.status(404).json({ error: 'Patient not found' });
        }

        // Find the file in the patient's documents array
        const file = patient.documents.find(doc => doc.filename === filename);
        if (!file) {
            return res.status(404).json({ error: 'File not found' });
        }

        // Construct the file path
        const filePath = path.join(__dirname, '..', 'uploads', filename);

        // Serve the file for download
        res.download(filePath, file.originalname, (err) => {
            if (err) {
                console.error('Error downloading file:', err);
                res.status(500).json({ error: 'An error occurred while downloading file' });
            }
        });
    } catch (error) {
        console.error('Error downloading file:', error);
        res.status(500).json({ error: 'An error occurred while downloading file' });
    }
});


module.exports = router;

