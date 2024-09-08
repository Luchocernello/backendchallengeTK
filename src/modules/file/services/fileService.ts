import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { Transaction } from '../../../entity/transaction';
import { AppDataSource } from '../../../data-source';

export default class FileService {
    public async readCSV(file: any, res: any) {
        const results: any[] = [];
        let headers: string[] = [];

        fs.createReadStream(file.path)
        .pipe(csv())
        .on('headers', (headerRow: string[]) => { headers = headerRow; })
        .on('data', (data) => results.push(data))
        .on('end', () => {
        fs.unlinkSync(file.path); // Remove file after processing
        return {headers, results};
      });
    }
    public async saveCSV(file: { headers: string; results: any; }) {
        const { headers, results } = file;
        const transactionRepository = AppDataSource.getRepository(Transaction);

        for (const row of results) {
            const transaction = new Transaction();
            transaction.id = row[headers[0]];
            transaction.date = row[headers[1]];
            transaction.amount = row[headers[2]];
            transaction.merchant = row[headers[3]];
            transaction.user_id = row[headers[4]];
  
            await transactionRepository.save(transaction);
        }
        return 
    }
}