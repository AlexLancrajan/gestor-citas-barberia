import express from 'express';
import { tokenExtractor } from './middleware';
import { userRouter } from './user/infrastructure/user-router';

const app = express();

app.use(express.json());
app.use(tokenExtractor);

app.use('/api/users', userRouter);

export default app;