import TransactionService from "../Services/transactionService";
import { Request, Response } from 'express';

export default class TransactionController {
    constructor(private transactionService: TransactionService){}
    
    public async flaggedTransactions(request: Request, response: Response) {
        try{
            const flaggedTransactions = await this.transactionService.getFlaggedTransactions();
            return response.status(200).json(flaggedTransactions);
        } catch (err) {
            console.log('Error.transactionController.flaggedTransactions: ', err);
            return response.status(400).json({ message: 'Error at getting transactions', err });
        }
    }
    
}