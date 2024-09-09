import { DataSource } from 'typeorm';
import { User } from './entity/user';
import { Transaction } from './entity/transaction';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'admin',
  database: 'postgres',
  synchronize: true,
  logging: false,
  entities: [User, Transaction],
  migrations: ['src/migration/*.ts'],
  subscribers: [],
});