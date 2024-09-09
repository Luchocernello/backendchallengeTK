import ReportService from "../Services/reportServices";
import { Request, Response } from 'express';

export default class ReportController {
    constructor(public reportService: ReportService) {}
    public async totalAmountTransactions(request: Request, response: Response) {
        try {
            const { period } = request.body();
            const amount = await this.reportService.getAmountByPeriod(period);
            return response.status(200).json({ message: amount })
        } catch (err) {
            console.log('Error.reportController.totalAmount: ', err);
        }
    };
    public async highestMerchant(request: Request, response: Response){
        try {
            const merchants = await this.reportService.get10BestMerchants();
            return response.status(200).json({ message: merchants })
        } catch (err) {
            console.log('Error.reportController.highestMerchant: ', err);
        }
    }
};