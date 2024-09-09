import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { Transaction } from '../../../entity/transaction';
import { AppDataSource } from '../../../data-source';

export default class FileService {
    public async readCSV(file: string) {
        return new Promise((resolve, reject) => {
            let results: any[] = [];

            fs.createReadStream(file)
            .pipe(csv())
            .on('data', (data) => {
                results.push(data); 
            })
            .on('end', () => {
            fs.unlinkSync(file)
            resolve(results);
            })
            .on('error', (error) => {
                console.error('error.FileService.readCSV: ', error);
                reject(error);})
        })
    }

    public async saveCSV(results: any) {

        for (const row of results) {
            const existingTransaction = await AppDataSource
            .createQueryBuilder()
            .select('transaction')
            .from(Transaction, 'transaction')
            .where('transaction.transaction_id = :transaction_id', { transaction_id: Number(row.transaction_id) })
            .getOne();

            if (existingTransaction) {
            console.log('Transaction already exists:', existingTransaction);
            } else {
                await AppDataSource.createQueryBuilder()
                .insert()
                .into(Transaction)
                .values({
                transaction_id: Number(row.transaction_id),
                date: new Date(row.date),
                amount: Number(row.amount),
                merchant: row.merchant,
                user_id: row.user_id,
                })
                .execute();
            }
        }
        return 
    }
}