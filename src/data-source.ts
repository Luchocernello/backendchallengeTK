import { DataSource } from 'typeorm';
import { User } from './entity/user';
import { Transaction } from './entity/transaction';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'backend',
  password: 'backend',
  database: 'challengeTK',
  synchronize: true,
  logging: false,
  entities: [User, Transaction],
});