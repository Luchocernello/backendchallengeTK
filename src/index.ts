import 'reflect-metadata';
import express from 'express';
import multer from 'multer';
import { createConnection } from 'typeorm';
import FileController from './modules/file/controllers/fileController';
import FileService from './modules/file/services/fileService';
import EmailService from './modules/file/services/emailService';

const upload = multer({ dest: 'uploads/' }); 
const app = express();
const port = process.env.PORT || 3000;
const fileService = new FileService();
const emailService = new EmailService();
const fileController = new FileController(fileService, emailService);

// Connect to PostgreSQL using TypeORM
createConnection().then(() => {
  console.log('Connected to PostgreSQL');

  // Route for uploading the CSV file
  app.post('/upload', upload.single('file'), (req, res) => {
    fileController.handleFileCSV(req, res);
    });

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}).catch(error => console.log(error));