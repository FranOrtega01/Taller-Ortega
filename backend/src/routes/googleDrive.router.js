import { Router } from 'express';
import { get } from '../controller/companies.controller.js';

const router = Router();

router.get('/', get);

router.post('/', (req, res) => {
    console.log("POST DESDE GOOGLE SCRIPTS: ", req.body)
    res.status(200).send({ status: "success", payload: req.body });
    
});


export default router;
