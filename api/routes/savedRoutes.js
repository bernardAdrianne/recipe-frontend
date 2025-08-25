import express from 'express';
import { saveRecipe, unsaveRecipe, getSavedRecipes } from '../controllers/saveController.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

router.post('/save', verifyToken, saveRecipe);
router.post('/unsave', verifyToken, unsaveRecipe);
router.get('/saved', verifyToken, getSavedRecipes);

export default router;
