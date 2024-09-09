import { Transaction } from "typeorm";
import { AppDataSource } from "../../../data-source";

const QUICK_SUCCESSION_MINS = 1; //Usamos process.env.QUICK_SUCCESSION_MINS 
const FLAG_AMOUNT_TRESHOLD = 10000; //process.env.FLAG_AMOUNT_TRESHOLD 

export default class TransactionService {
    public async flagTransactions() {
        const quickSuccessionTimeWindow = (QUICK_SUCCESSION_MINS * 60 * 1000);
    try {
        await this.amountTreshold(FLAG_AMOUNT_TRESHOLD);
        await this.sameMerchantQuickSuccession(quickSuccessionTimeWindow);
    } catch (err) {
        console.log('Error.transactionService.flagTransactions: ', err)
        };
    };

    public async getFlaggedTransactions(): Promise<Transaction[]> {
        return await AppDataSource
          .createQueryBuilder()
          .select('transaction')
          .from(Transaction, 'transaction')
          .where('transaction.flagged = :flagged', { flagged: true })
          .getMany();
      };
    
    private async amountTreshold(FLAG_AMOUNT_THRESHOLD: number) {
        await AppDataSource
            .createQueryBuilder()
            .update(Transaction)
            .set({ flagged: true })
            .where('amount > :threshold', { threshold: FLAG_AMOUNT_THRESHOLD })
            .execute();
    }
    private async sameMerchantQuickSuccession(quickSuccessionTimeWindow: number) {
        const transactions = await AppDataSource
            .createQueryBuilder()
            .select('transaction.merchant', 'merchant')
            .addSelect('transaction.date', 'date')
            .addSelect('transaction.id', 'id')
            .from(Transaction, 'transaction')
            .orderBy('transaction.date', 'ASC')
            .getRawMany();
    
        const flaggedTransactionIds = new Set<number>();
        const merchantTransactions: Record<string, { date: Date; ids: number[] }> = {};
    
        transactions.forEach(transaction => {
            const { merchant, date, id } = transaction;
            const transactionDate = new Date(date);
    
            if (!merchantTransactions[merchant]) {
                merchantTransactions[merchant] = { date: transactionDate, ids: [id] };
                return;
            }
    
            const lastTransaction = merchantTransactions[merchant];
            const timeDifference = transactionDate.getTime() - lastTransaction.date.getTime();
    
            if (timeDifference <= quickSuccessionTimeWindow) {
                flaggedTransactionIds.add(id);
                lastTransaction.ids.push(id);
            } else {
                lastTransaction.date = transactionDate;
                lastTransaction.ids = [id];
            }
        });
    
        if (flaggedTransactionIds.size > 0) {
            await AppDataSource
                .createQueryBuilder()
                .update(Transaction)
                .set({ flagged: true }) 
                .whereInIds(Array.from(flaggedTransactionIds))
                .execute();
        }
    }
}
