import { Router } from 'express';
import { get, getByID, create, update, deleteOne} from '../controller/estimates.controller.js';

const router = Router();

router.get('/', get);

router.get('/:id', getByID);

router.post('/', create);

router.put('/:id', update);

router.delete('/:id', deleteOne)

export default router;
