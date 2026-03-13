import { Request, Response } from 'express';
import { Op } from 'sequelize';
import Product from '../models/Product';
import Brand from '../models/Brand';
import Category from '../models/Category';
import fs from 'fs';
import path from 'path';

const INCLUDE = [
  { model: Brand,    as: 'Brand',    attributes: ['id', 'name'] },
  { model: Category, as: 'Category', attributes: ['id', 'name'] },
];

// GET /api/products?page=1&limit=10&search=nombre&brand_id=&category_id=&stock_max=5&sort=newest|price_asc|price_desc|name_asc
export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const page        = parseInt(req.query['page'] as string) || 1;
    const limit       = parseInt(req.query['limit'] as string) || 10;
    const search      = (req.query['search'] as string) || '';
    const brand_id    = req.query['brand_id'];
    const category_id = req.query['category_id'];
    const stockMax    = req.query['stock_max'] ? parseInt(req.query['stock_max'] as string) : null;
    const sort        = (req.query['sort'] as string) || 'newest';
    const offset      = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    if (search) where.name = { [Op.iLike]: `%${search}%` };
    if (brand_id)    where.brand_id    = brand_id;
    if (category_id) where.category_id = category_id;
    if (stockMax !== null) where.stock = { [Op.lte]: stockMax };

    const orderMap: Record<string, [string, string]> = {
      'newest':     ['createdAt', 'DESC'],
      'price_asc':  ['price', 'ASC'],
      'price_desc': ['price', 'DESC'],
      'name_asc':  ['name', 'ASC'],
    };
    const order = orderMap[sort] || ['createdAt', 'DESC'];

    const { count, rows } = await Product.findAndCountAll({
      where,
      include: INCLUDE,
      limit,
      offset,
      order: [order],
    });

    res.json({
      data: rows,
      pagination: { total: count, page, limit, totalPages: Math.ceil(count / limit) },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener productos', error });
  }
};

// GET /api/products/:id
export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await Product.findByPk(req.params['id'], { include: INCLUDE });
    if (!product) { res.status(404).json({ message: 'Producto no encontrado' }); return; }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener producto', error });
  }
};

// POST /api/products
export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, price, stock, brand_id, category_id, size, color } = req.body;
    const image_url = req.file ? `/uploads/${req.file.filename}` : null;

    if (!name || !description || !price) {
      res.status(400).json({ message: 'Nombre, descripción y precio son requeridos' });
      return;
    }

    const product = await Product.create({
      name, description, price, stock,
      brand_id:    brand_id    || null,
      category_id: category_id || null,
      size:        size        || null,
      color:       color       || null,
      image_url,
    });

    const full = await Product.findByPk(product.id, { include: INCLUDE });
    res.status(201).json({ message: 'Producto creado', product: full });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear producto', error });
  }
};

// PUT /api/products/:id
export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await Product.findByPk(req.params['id']);
    if (!product) { res.status(404).json({ message: 'Producto no encontrado' }); return; }

    const { name, description, price, stock, brand_id, category_id, size, color } = req.body;

    if (req.file) {
      if (product.image_url) {
        const oldPath = path.join(__dirname, '../../', product.image_url);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      product.image_url = `/uploads/${req.file.filename}`;
    }

    if (name)        product.name        = name;
    if (description) product.description = description;
    if (price)       product.price       = price;
    if (stock !== undefined) product.stock = stock;
    product.brand_id    = brand_id    || null;
    product.category_id = category_id || null;
    product.size        = size        || null;
    product.color       = color       || null;

    await product.save();
    const full = await Product.findByPk(product.id, { include: INCLUDE });
    res.json({ message: 'Producto actualizado', product: full });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar producto', error });
  }
};

// DELETE /api/products/:id
export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await Product.findByPk(req.params['id']);
    if (!product) { res.status(404).json({ message: 'Producto no encontrado' }); return; }

    if (product.image_url) {
      const imgPath = path.join(__dirname, '../../', product.image_url);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }

    await product.destroy();
    res.json({ message: 'Producto eliminado' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar producto', error });
  }
};