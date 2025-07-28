import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { getGeminiResponse, parseGeminiJson } from '../gemini-ai-handler';

import fs from "fs";

const router = Router();
const prisma = new PrismaClient();

// Create
router.post('/', async (req: Request, res: Response) => {
  try {
    console.log(`Creating learning path for ${req.body.name}`);
    const learningPath = await prisma.learningPath.create({
      data: req.body,
    });
    
    console.log(`Generating categories for ${learningPath.name}`);
    const categories = parseGeminiJson((await getGeminiResponse(`i want to create a learning path for this topic: ${learningPath.name}: ${learningPath.description}. create an array of categories with topic to learn. ${(learningPath.budged_type == 'inexpensive') ? 'if you include software or other things that could cost money, rather select free or inexpensive options' : ((learningPath.budged_type == 'free') ? 'if you include software or other things that could cost money, rather select free or inexpensive options':'')} respond with an array of objects containing the name andonther array of smaller topics/steps to learn respond with json. return Array<{categoryName:string,steps:Array<string>}>`))!)
    // const categories: Array<{[key: string]: string}> = JSON.parse(await fs.readFileSync("./src/ai-cache/categories.txt", "utf-8"));
    console.log("Generated categories:")
    console.log(categories.map((c) => c.categoryName))
    for (const c of categories) {
      const category = await prisma.category.create({
        data: {
          name: c.categoryName,
          content_description: "",
          description: "",
          learning_path_id: learningPath.id
        }
      });
      console.log(`Generating steps for category ${c.categoryName}`);
      const categoryStepsRaw = await getGeminiResponse(`respond in json. i need information and instruction texts for multiple steps of a topic to learn. this is the topic: ${c.categoryName}. these are the steps: ${c.steps}. i need an array of objects with one object containing one step. for each step also provide goals to achive to mark the step as completed. return Array<{stepName:string,text:string,goals:Array<string>}>`);
      const categorySteps: Array<{[key: string]: string}> = parseGeminiJson(categoryStepsRaw!)

      categorySteps.forEach(async (s) => {
        console.log(`Saving step ${s.stepName}`)
        const step = await prisma.step.create({
          data: {
            description: s.text,
            name: s.stepName,
            category_id: category.id
          }
        });

        s.goals.forEach(async (g) => {
          const goal = await prisma.goal.create({
            data: {
              name: g,
              description: "",
              step_id: step.id
            }
          })
        });
      })
      // const step = await prisma.step.create({

      // })

      

    };

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
      select: {
        id: true,
        categories: {
          select: {
            id: true,
            name: true,
            steps: true
          }
        },
        description: true,
        name: true
      }
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
