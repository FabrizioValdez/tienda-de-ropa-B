import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import sequelize from './config/database';
import authRoutes from './routes/auth.routes';
import productRoutes from './routes/product.routes';
import userRoutes from './routes/user.routes';
import brandRoutes from './routes/brand.routes';
import categoryRoutes from './routes/category.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api/auth',       authRoutes);
app.use('/api/products',   productRoutes);
app.use('/api/users',      userRoutes);
app.use('/api/brands',     brandRoutes);
app.use('/api/categories', categoryRoutes);

app.get('/api/health', (_req, res) => res.json({ status: 'OK', timestamp: new Date() }));

sequelize.sync({ alter: true }).then(() => {
  console.log('✅ Base de datos conectada y sincronizada');
  app.listen(PORT, () => console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`));
}).catch((error) => console.error('❌ Error al conectar la base de datos:', error));

export default app;