import 'reflect-metadata';
import express from 'express';
import multer from 'multer';
import FileController from './modules/file/Controllers/fileController';
import FileService from './modules/file/Services/fileService';
import EmailService from './modules/file/Services/emailService';
import path from 'path';
import { AppDataSource } from './data-source';
import ReportController from './modules/reports/Controller/reportController';
import ReportService from './modules/reports/Services/reportServices';
import TransactionService from './modules/file/Services/transactionService';
import TransactionController from './modules/file/Controllers/transactionController';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`);
  }
});

const csvFileFilter = (req: express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.mimetype === 'text/csv' || file.mimetype === 'application/vnd.ms-excel') {
    cb(null, true); 
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: csvFileFilter,
});

const app = express();
const port = process.env.PORT || 3000;
const fileService = new FileService();
const emailService = new EmailService();
const transactionService = new TransactionService();
const fileController = new FileController(fileService, emailService, transactionService);
const reportService = new ReportService();
const reportController = new ReportController(reportService);
const transactionController = new TransactionController(transactionService);

AppDataSource.initialize()
  .then(() => {
  console.log('Connected to PostgreSQL');

  app.post('/upload', upload.single('file'), (req, res) => {
    fileController.handleFileCSV(req, res);
    });
  app.get('/totalAmount',(req, res) => {
    reportController.totalAmountTransactions(req, res);
  });
  app.get('/highestMerchants', (req, res) => {
    reportController.highestMerchant(req, res);
  });
  app.get('/flagged-transactions', (req, res) => {
    transactionController.flaggedTransactions(req, res);
  });
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}).catch(error => console.log(error));