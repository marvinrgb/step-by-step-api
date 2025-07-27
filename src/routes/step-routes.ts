import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Create
router.post('/', async (req: Request, res: Response) => {
  try {
    const step = await prisma.step.create({
      data: req.body,
    });
    res.status(201).json(step);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create step' });
  }
});

// Read all
router.get('/', async (req: Request, res: Response) => {
  try {
    const steps = await prisma.step.findMany();
    res.json(steps);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch steps' });
  }
});

// Read one
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const step = await prisma.step.findUnique({
      where: { id },
    });
    if (!step) {
      return res.status(404).json({ error: 'Step not found' });
    }
    res.json(step);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch step' });
  }
});

// Update
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const step = await prisma.step.update({
      where: { id },
      data: req.body,
    });
    res.json(step);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update step' });
  }
});

// Delete
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.step.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete step' });
  }
});

export default router;
