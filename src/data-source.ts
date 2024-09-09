import { DataSource } from 'typeorm';
import { User } from './entity/user';
import { Transaction } from './entity/transaction';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  logging: false,
  entities: [User, Transaction],
  migrations: ['src/migration/*.ts'],
  subscribers: [],
});