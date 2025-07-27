import { Router }from 'express';
const router = Router();

import defaultRoute from './default-route.js';
import learningPathRoute from './learning-path-routes.js';
import categoryRoute from './category-routes.js';
import stepRoute from './step-routes.js';
import goalRoute from './goal-routes.js';

router.use('/default', defaultRoute);
router.use('/learning-paths', learningPathRoute);
router.use('/categories', categoryRoute);
router.use('/steps', stepRoute);
router.use('/goals', goalRoute);

export default router;