import EmailService from '../Services/emailService';
import FileService from '../Services/fileService';
import { Request, Response } from 'express';
import TransactionService from '../Services/transactionService';

export default class FileController {
    constructor(private fileService: FileService,
        private emailService: EmailService,
        private transactionService: TransactionService,
    ){}
    public async handleFileCSV(request: Request, response: Response) {
        try {
          const file = request.file;
      
          if (!file) {
            return response.status(400).send('No file uploaded.');
          }
          const filePath = file.path;
          const processFile: any = await this.fileService.readCSV(filePath);
          await this.fileService.saveCSV(processFile);
          await this.transactionService.flagTransactions();
          //await this.emailService.sendNotificationOneSelf(process.env.SUBJECT_SUCESSFULL, process.env.TEXT_SUCESSFULL)
          return response.status(200).json({ message: 'Saved file in database and transactions flagged'});
        } catch (error) {
          console.log('Error.fileController.handleFileCSV: ', error);
          //await this.emailService.sendNotificationOneSelf(process.env.SUBJECT_FAIL, process.env.TEXT_FAIL)
          return response.status(400).json({ message: 'Error processing file', error });
        }
      };
};


