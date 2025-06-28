// backend/index.js
import express from 'express';
import cors from 'cors';
import routeRoutes from './routes/routePath.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/route', routeRoutes);

app.listen(8000, () => {
  console.log('Server started on port 8000');
});
