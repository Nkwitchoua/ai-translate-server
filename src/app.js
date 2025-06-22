import express from 'express';
import dotenv from 'dotenv';
import routes from './routes/index.js';
import { authBotMiddleware } from './middleware/auth.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// global identification
app.use(authBotMiddleware);

app.use('/', routes);

app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});
