import { Router, Response } from "express";
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  softDeleteCategory,
} from "../services/category/category.service";
import {
  authenticate,
  authorize,
  AuthRequest,
} from "../middlewares/auth.middleware";

const router = Router();

// GET /api/categories  (public)
router.get("/", async (req, res: Response) => {
  try {
    const categories = await getAllCategories();
    res.json({
      success: true,
      message: "Categories retrieved successfully",
      data: categories,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch categories" });
  }
});

// GET /api/categories/:id  (public)
router.get("/:id", async (req, res: Response) => {
  try {
    const category = await getCategoryById(Number(req.params.id));
    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }
    res.json({
      success: true,
      message: "Category retrieved successfully",
      data: category,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch category" });
  }
});

// POST /api/categories  (ADMIN only)
router.post(
  "/",
  authenticate,
  authorize("ADMIN"),
  async (req: AuthRequest, res: Response) => {
    try {
      const { name, description } = req.body;
      if (!name) {
        return res
          .status(400)
          .json({ success: false, message: "name is required" });
      }
      const category = await createCategory({ name, description });
      res.status(201).json({
        success: true,
        message: "Category created successfully",
        data: category,
      });
    } catch (error) {
      res
        .status(400)
        .json({ success: false, message: "Could not create category" });
    }
  },
);

// PUT /api/categories/:id  (ADMIN only)
router.put(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  async (req: AuthRequest, res: Response) => {
    try {
      const category = await updateCategory(Number(req.params.id), req.body);
      res.json({
        success: true,
        message: "Category updated successfully",
        data: category,
      });
    } catch (error) {
      res.status(404).json({ success: false, message: "Category not found" });
    }
  },
);

// DELETE /api/categories/:id  (ADMIN only, soft delete)
router.delete(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  async (req: AuthRequest, res: Response) => {
    try {
      const category = await softDeleteCategory(Number(req.params.id));
      res.json({
        success: true,
        message: "Category deleted successfully",
        data: category,
      });
    } catch (error) {
      res.status(404).json({ success: false, message: "Category not found" });
    }
  },
);

export default router;
