"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const user_1 = require("./entity/user");
const transaction_1 = require("./entity/transaction");
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'backend',
    password: 'backend',
    database: 'challengeTK',
    synchronize: true,
    logging: false,
    entities: [user_1.User, transaction_1.Transaction],
});
