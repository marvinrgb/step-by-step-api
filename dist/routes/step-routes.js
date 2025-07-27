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
        const step = yield prisma.step.create({
            data: req.body,
        });
        res.status(201).json(step);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create step' });
    }
}));
// Read all
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const steps = yield prisma.step.findMany();
        res.json(steps);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch steps' });
    }
}));
// Read one
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const step = yield prisma.step.findUnique({
            where: { id },
        });
        if (!step) {
            return res.status(404).json({ error: 'Step not found' });
        }
        res.json(step);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch step' });
    }
}));
// Update
router.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const step = yield prisma.step.update({
            where: { id },
            data: req.body,
        });
        res.json(step);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update step' });
    }
}));
// Delete
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield prisma.step.delete({
            where: { id },
        });
        res.status(204).send();
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete step' });
    }
}));
exports.default = router;
