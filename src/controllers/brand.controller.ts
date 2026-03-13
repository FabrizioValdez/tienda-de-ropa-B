import { Request, Response } from 'express';
import Brand from '../models/Brand';

export const getBrands = async (_req: Request, res: Response): Promise<void> => {
  try {
    const brands = await Brand.findAll({ order: [['name', 'ASC']] });
    res.json(brands);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener marcas', error });
  }
};

export const createBrand = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name } = req.body;
    if (!name) { res.status(400).json({ message: 'Nombre requerido' }); return; }
    const brand = await Brand.create({ name });
    res.status(201).json(brand);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear marca', error });
  }
};

export const deleteBrand = async (req: Request, res: Response): Promise<void> => {
  try {
    const brand = await Brand.findByPk(req.params['id']);
    if (!brand) { res.status(404).json({ message: 'Marca no encontrada' }); return; }
    await brand.destroy();
    res.json({ message: 'Marca eliminada' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar marca', error });
  }
};