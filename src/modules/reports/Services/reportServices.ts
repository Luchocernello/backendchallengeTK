import { Transaction } from "typeorm";
import { AppDataSource } from "../../../data-source";

interface DateRange {
    startDate: Date;
    endDate: Date;
}

export default class ReportService {
    public async getAmountByPeriod(period: 'day' | 'week' | 'month') {
        const today = new Date();
        const periodDictionary = {
            day: 1,
            week: 7,
            month: 30
        };
        const days = periodDictionary[period]
        if (days === undefined) {
            throw new Error('Invalid period');
        }
        const { startDate, endDate } = getDateRange(days, today)

        const transactions = await AppDataSource
            .createQueryBuilder()
            .select('transaction')
            .from(Transaction, 'transaction')
            .where('transaction.date BETWEEN :startDate AND :endDate', { startDate, endDate })
            .getMany();

        return transactions;
    };

    public async get10BestMerchants() {
        const topMerchants = await AppDataSource
            .createQueryBuilder()
            .select('transaction.merchant', 'merchant')
            .addSelect('SUM(transaction.amount)', 'totalAmount')
            .from(Transaction, 'transaction')
            .groupBy('transaction.merchant')
            .orderBy('totalAmount', 'DESC')
            .limit(10)
            .getRawMany();
        return topMerchants;
    }
}

function getDateRange(days: number, today: Date) {

    if (days === undefined) {
        throw new Error('Invalid period');
    }

    const startDate = new Date(today);
    startDate.setDate(today.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    return {
        startDate,
        endDate: today
    };
}

