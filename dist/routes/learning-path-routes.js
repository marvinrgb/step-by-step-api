"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const gemini_ai_handler_1 = require("../gemini-ai-handler");
const fs_1 = __importDefault(require("fs"));
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
// Create
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const learningPath = yield prisma.learningPath.create({
            data: req.body,
        });
        // const categories = await getGeminiResponse(`i want to create a learning path for this topic: ${learningPath.name}: ${learningPath.description}. create an array of categories with topic to learn. respond with an array of objects containing the name andonther array of smaller topics/steps to learn. return Array<{categoryName:string,steps:Array<string>}>`)
        const categories = JSON.parse(yield fs_1.default.readFileSync("./src/ai-cache/categories.txt", "utf-8"));
        console.log("Generated categories:");
        console.log(categories.map((c) => c.categoryName));
        for (const c of categories) {
            const category = yield prisma.category.create({
                data: {
                    name: c.categoryName,
                    content_description: "",
                    description: "",
                    learning_path_id: learningPath.id
                }
            });
            console.log(`Generating steps for category ${c.categoryName}`);
            const categoryStepsRaw = yield (0, gemini_ai_handler_1.getGeminiResponse)(`respond in json. i need information and instruction texts for multiple steps of a topic to learn. this is the topic: ${c.categoryName}. these are the steps: ${c.steps}. i need an array of objects with one object containing one step. for each step also provide goals to achive to mark the step as completed. return Array<{stepName:string,text:string,goals:Array<string>}>`);
            const categorySteps = (0, gemini_ai_handler_1.parseGeminiJson)(categoryStepsRaw);
            categorySteps.forEach((s) => __awaiter(void 0, void 0, void 0, function* () {
                console.log(`Saving step ${s.stepName}`);
                const step = yield prisma.step.create({
                    data: {
                        description: s.text,
                        name: s.stepName,
                        category_id: category.id
                    }
                });
                s.goals.forEach((g) => __awaiter(void 0, void 0, void 0, function* () {
                    const goal = yield prisma.goal.create({
                        data: {
                            name: g,
                            description: "",
                            step_id: step.id
                        }
                    });
                }));
            }));
            // const step = await prisma.step.create({
            // })
        }
        ;
        res.status(201).json(categories);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create learning path' });
    }
}));
// Read all
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const learningPaths = yield prisma.learningPath.findMany();
        res.json(learningPaths);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch learning paths' });
    }
}));
// Read one
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const learningPath = yield prisma.learningPath.findUnique({
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch learning path' });
    }
}));
// Update
router.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const learningPath = yield prisma.learningPath.update({
            where: { id },
            data: req.body,
        });
        res.json(learningPath);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update learning path' });
    }
}));
// Delete
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield prisma.learningPath.delete({
            where: { id },
        });
        res.status(204).send();
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete learning path' });
    }
}));
exports.default = router;
