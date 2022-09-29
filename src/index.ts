import 'reflect-metadata';
import { AppDataSource } from './data-source';
import { serve } from './api';

AppDataSource.initialize()
  .then(async () => {
    console.log('Database connection established');
    await serve();
  })
  .catch(error => {
    console.error('Error connecting to database', error);
  });
