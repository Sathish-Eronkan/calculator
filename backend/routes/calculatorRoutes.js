import express from "express";
const router = express.Router();
import { setValues, setOperations, updateCalculator, resetCalculator } from "../controllers/Controller.js";
router.route('/init').post(setValues);
router.route('/operation').post(setOperations);
router.route('/undo').put(updateCalculator);
router.route('/reset').get(resetCalculator);

export default router;