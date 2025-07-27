"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const default_route_js_1 = __importDefault(require("./default-route.js"));
const learning_path_routes_js_1 = __importDefault(require("./learning-path-routes.js"));
const category_routes_js_1 = __importDefault(require("./category-routes.js"));
const step_routes_js_1 = __importDefault(require("./step-routes.js"));
const goal_routes_js_1 = __importDefault(require("./goal-routes.js"));
router.use('/default', default_route_js_1.default);
router.use('/learning-paths', learning_path_routes_js_1.default);
router.use('/categories', category_routes_js_1.default);
router.use('/steps', step_routes_js_1.default);
router.use('/goals', goal_routes_js_1.default);
exports.default = router;
