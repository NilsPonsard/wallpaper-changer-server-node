import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
    type: "postgres",
    url: process.env.DATABASE_URL,
    logging: true,
    synchronize: true,
    entities: [__dirname + "/entities/*.ts", __dirname + "/entities/*.js"],
});
