import { Router } from 'express';
import { get, create, getById, update, deleteOne } from '../controller/clients.controller.js';

const router = Router();

router.get('/clients', get);

router.get('/client/:id', getById);

router.post('/client', create);

router.put('/client/:id', update);

router.delete("/:id", deleteOne);

export default router;
