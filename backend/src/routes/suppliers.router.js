import { Router } from 'express';
import { get, create, update, getByID, deleteOne } from '../controller/suppliers.controller.js';

const router = Router();

router.get('/suppliers', get);

router.get('/suppliers/:id', getByID);

router.post('/suppliers', create);

router.put('/suppliers/:id', update);

router.delete('/suppliers/:id', deleteOne)

export default router;
