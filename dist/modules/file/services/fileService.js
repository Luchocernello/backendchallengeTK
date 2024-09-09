"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const csv_parser_1 = __importDefault(require("csv-parser"));
const transaction_1 = require("../../../entity/transaction");
const data_source_1 = require("../../../data-source");
class FileService {
    readCSV(file, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const results = [];
            let headers = [];
            fs_1.default.createReadStream(file.path)
                .pipe((0, csv_parser_1.default)())
                .on('headers', (headerRow) => { headers = headerRow; })
                .on('data', (data) => results.push(data))
                .on('end', () => {
                fs_1.default.unlinkSync(file.path); // Remove file after processing
                return { headers, results };
            });
        });
    }
    saveCSV(file) {
        return __awaiter(this, void 0, void 0, function* () {
            const { headers, results } = file;
            const transactionRepository = data_source_1.AppDataSource.getRepository(transaction_1.Transaction);
            for (const row of results) {
                const transaction = new transaction_1.Transaction();
                transaction.id = row[headers[0]];
                transaction.date = row[headers[1]];
                transaction.amount = row[headers[2]];
                transaction.merchant = row[headers[3]];
                transaction.user_id = row[headers[4]];
                yield transactionRepository.save(transaction);
            }
            return;
        });
    }
}
exports.default = FileService;
