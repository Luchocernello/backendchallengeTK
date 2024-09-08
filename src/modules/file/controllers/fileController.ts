import EmailService from '../services/emailService';
import FileService from '../services/fileService';
import { Request, Response } from 'express';

export default class FileController {
    constructor(public fileService: FileService,
        private emailService: EmailService
    ){}
    public async handleFileCSV(request: Request, response: Response) {
        try {
          const file = request.file;
      
          if (!file) {
            return response.status(400).send('Not file uploaded.');
          }
      
          const processFile: any = await this.fileService.readCSV(file.path, response);
          await this.fileService.saveCSV(processFile);
          await this.emailService.sendNotificationOneSelf(process.env.SUBJECT_SUCESSFULL, process.env.TEXT_SUCESSFULL)
          return response.status(200).json({ message: 'Saved file in database'});
        } catch (error) {
          await this.emailService.sendNotificationOneSelf(process.env.SUBJECT_FAIL, process.env.TEXT_FAIL)
          return response.status(500).json({ message: 'Error processing file', error });
        }
      };
};


