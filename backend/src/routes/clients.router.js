import { Router } from 'express';
import { get, create, getById, update, deleteOne } from '../controller/clients.controller.js';

const router = Router();

router.get('/', get);

router.get('/:id', getById);

router.post('/', create);

router.put('/:id', update);

router.delete("/:id", deleteOne);

export default router;
