import { Router } from 'express';
import { get } from '../controller/companies.controller.js';

const router = Router();

router.get('/', get);

export default router;
