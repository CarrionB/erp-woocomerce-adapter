import 'dotenv/config'
import express from 'express';
import cookieParser from 'cookie-parser';
import logger from './src/utilities/logger';
import routes from './src/routes';

const {PORT} = process.env;

const app = express();

app.use(cookieParser())

app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}.`);
  routes(app)
});
