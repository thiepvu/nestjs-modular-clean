import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { User } from '../../modules/users/domain/entities/user.entity';
import { Product } from '../../modules/products/domain/entities/product.entity';
import { Order } from '../../modules/orders/domain/entities/order.entity';

// Load environment variables
config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT ?? "5432", 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [User, Product, Order],
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
  synchronize: false,
  logging: true,
});