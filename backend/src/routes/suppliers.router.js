import { Router } from 'express';
import { get, create, update, getByID, deleteOne } from '../controller/suppliers.controller.js';

const router = Router();

router.get('/', get);

router.get('/:id', getByID);

router.post('/', create);

router.put('/:id', update);

router.delete('/:id', deleteOne)

export default router;
