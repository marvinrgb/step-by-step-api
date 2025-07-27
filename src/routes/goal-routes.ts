import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Create
router.post('/', async (req: Request, res: Response) => {
  try {
    const goal = await prisma.goal.create({
      data: req.body,
    });
    res.status(201).json(goal);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create goal' });
  }
});

// Read all
router.get('/', async (req: Request, res: Response) => {
  try {
    const goals = await prisma.goal.findMany();
    res.json(goals);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch goals' });
  }
});

// Read one
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const goal = await prisma.goal.findUnique({
      where: { id },
    });
    if (!goal) {
      return res.status(404).json({ error: 'Goal not found' });
    }
    res.json(goal);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch goal' });
  }
});

// Update
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const goal = await prisma.goal.update({
      where: { id },
      data: req.body,
    });
    res.json(goal);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update goal' });
  }
});

// Delete
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.goal.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete goal' });
  }
});

export default router;
