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
        const goal = yield prisma.goal.create({
            data: req.body,
        });
        res.status(201).json(goal);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create goal' });
    }
}));
// Read all
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const goals = yield prisma.goal.findMany();
        res.json(goals);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch goals' });
    }
}));
// Read one
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const goal = yield prisma.goal.findUnique({
            where: { id },
        });
        if (!goal) {
            return res.status(404).json({ error: 'Goal not found' });
        }
        res.json(goal);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch goal' });
    }
}));
// Update
router.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const goal = yield prisma.goal.update({
            where: { id },
            data: req.body,
        });
        res.json(goal);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update goal' });
    }
}));
// Delete
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield prisma.goal.delete({
            where: { id },
        });
        res.status(204).send();
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete goal' });
    }
}));
exports.default = router;
