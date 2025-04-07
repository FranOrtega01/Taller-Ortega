import { Router } from 'express';
import { get, create, update, deleteOne } from '../controller/jobs.controller.js';

const router = Router();

router.get('/', get);
router.post('/', create);
router.put('/:id', update);
router.put('')
router.delete('/:id', deleteOne);

export default router;