import { Router } from 'express';
import { get, create, update, getByID, deleteOne, getForDropdown} from '../controller/companies.controller.js';

const router = Router();

router.get('/companies', get);

router.get('/company/:id', getByID);

router.post('/', create);

router.put('/:id', update);

router.delete('/:id', deleteOne)

export default router;
