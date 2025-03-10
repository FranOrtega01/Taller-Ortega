import { Router } from 'express';
import { get, create } from '../controller/companies.controller.js';

const router = Router();

router.get('/', get);

router.post('/', create);

export default router;
