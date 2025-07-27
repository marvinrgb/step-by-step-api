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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
// Create
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const category = yield prisma.category.create({
            data: req.body,
        });
        res.status(201).json(category);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create category' });
    }
}));
// Read all
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = yield prisma.category.findMany();
        res.json(categories);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch categories' });
    }
}));
// Read one
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const category = yield prisma.category.findUnique({
            where: { id },
        });
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }
        res.json(category);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch category' });
    }
}));
// Update
router.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const category = yield prisma.category.update({
            where: { id },
            data: req.body,
        });
        res.json(category);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update category' });
    }
}));
// Delete
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield prisma.category.delete({
            where: { id },
        });
        res.status(204).send();
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete category' });
    }
}));
exports.default = router;
