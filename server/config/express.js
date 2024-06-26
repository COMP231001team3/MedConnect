//Iuliia Chugunova
//Configuration of expressjs app. Imports necessary middleware, mounts routes
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const compress = require('compression');
const multer = require('multer');
const path = require('path');
const morgan = require('morgan'); //for logging

const doctorRoutes = require('../routes/doctorRoute');
const patientRoutes = require('../routes/patientRoute');
const appointmentRoutes = require('../routes/appointmentRoute');
const userRoute = require('../routes/userRoute');
const uploadFiles = require('../routes/uploadFileRoute');

module.exports = function () {
    const app = express();

    if (process.env.NODE_ENV === 'development') {
        app.use(morgan('dev')); // Enable logging in development
    } else if (process.env.NODE_ENV === 'production') {
        app.use(compress());
    }

    const corsOptions = {
        origin: '*', // Adjust this to your specific domain(s)
        credentials: true,
        optionSuccessStatus: 200,
    };

    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, path.join(__dirname, '..', 'uploads')); // Absolute path to the uploads directory
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

    app.use(cors(corsOptions));

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(methodOverride());

    // Serve static files from the "public" or "static" folder
    app.use(express.static(path.join(__dirname, 'public')));

    // Mount routes
    app.use('/patients', patientRoutes);
    app.use('/doctors', doctorRoutes);
    app.use('/appointments', appointmentRoutes);
    app.use('/', userRoute);
    app.use('/', uploadFiles)

    // Serve React build folder in production
    if (process.env.NODE_ENV === 'production') {
        app.use(express.static(path.join(__dirname, 'frontend', 'build')));
        app.get('*', (req, res) => {
            res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
        });
    }

    return app;
};
