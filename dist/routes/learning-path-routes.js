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
        categories.forEach((c) => __awaiter(void 0, void 0, void 0, function* () {
            const categorySteps = yield (0, gemini_ai_handler_1.getGeminiResponse)(``);
        }));
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
