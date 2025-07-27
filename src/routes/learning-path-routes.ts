import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { getGeminiResponse } from '../gemini-ai-handler';
import fs from "fs";

const router = Router();
const prisma = new PrismaClient();

// Create
router.post('/', async (req: Request, res: Response) => {
  try {
    const learningPath = await prisma.learningPath.create({
      data: req.body,
    });
    // const categories = await getGeminiResponse(`i want to create a learning path for this topic: ${learningPath.name}: ${learningPath.description}. create an array of categories with topic to learn. respond with an array of objects containing the name andonther array of smaller topics/steps to learn. return Array<{categoryName:string,steps:Array<string>}>`)
    const categories: Array<{[key: string]: string}> = JSON.parse(await fs.readFileSync("./src/ai-cache/categories.txt", "utf-8"));
    console.log("Generated categories:")
    console.log(categories.map((c) => c.categoryName))
    categories.forEach(async (c) => {
      const categorySteps = await getGeminiResponse(``);
    });

    res.status(201).json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create learning path' });
  }
});

// Read all
router.get('/', async (req: Request, res: Response) => {
  try {
    const learningPaths = await prisma.learningPath.findMany();
    res.json(learningPaths);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch learning paths' });
  }
});

// Read one
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const learningPath = await prisma.learningPath.findUnique({
      where: { id },
    });
    if (!learningPath) {
      return res.status(404).json({ error: 'Learning path not found' });
    }
    res.json(learningPath);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch learning path' });
  }
});

// Update
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const learningPath = await prisma.learningPath.update({
      where: { id },
      data: req.body,
    });
    res.json(learningPath);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update learning path' });
  }
});

// Delete
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.learningPath.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete learning path' });
  }
});

export default router;
