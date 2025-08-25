import User from "../model/userModel.js";
import Recipe from "../model/recipeModel.js";
import { errorHandler } from "../utils/error.js";

// Save a recipe
export const saveRecipe = async (req, res, next) => {
  try {
    const { recipeId } = req.body;

    if (!recipeId) {
      return res.status(400).json({ success: false, message: "Recipe ID required" });
    }

    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ success: false, message: "Recipe not found" });
    }

    const user = await User.findById(req.user.id);

    if (user.savedRecipes.includes(recipeId)) {
      return res.status(400).json({ success: false, message: "Recipe already saved" });
    }

    user.savedRecipes.push(recipeId);
    await user.save();

    res.status(201).json({ success: true, message: "Recipe saved" });
  } catch (err) {
    console.error("Save error:", err);
    next(errorHandler(500, "Failed to save recipe"));
  }
};

// Unsave a recipe
export const unsaveRecipe = async (req, res, next) => {
  try {
    const { recipeId } = req.body;

    const user = await User.findById(req.user.id);

    if (!user.savedRecipes.includes(recipeId)) {
      return res.status(404).json({ success: false, message: "Recipe not saved" });
    }

    user.savedRecipes = user.savedRecipes.filter(id => id.toString() !== recipeId);
    await user.save();

    res.status(200).json({ success: true, message: "Recipe unsaved" });
  } catch (err) {
    console.error("Unsave error:", err);
    next(errorHandler(500, "Failed to unsave recipe"));
  }
};

// Fetch all saved recipes
export const getSavedRecipes = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate("savedRecipes"); 

    res.status(200).json({ success: true, results: user.savedRecipes });
  } catch (err) {
    console.error("Fetch saved error:", err);
    next(errorHandler(500, "Failed to fetch saved recipes"));
  }
};
