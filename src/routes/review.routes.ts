import { Router, Response } from "express";
import {
  createReview,
  getAllReviews,
  getReviewById,
  updateReview,
  softDeleteReview,
} from "../services/review/review.service";
import {
  authenticate,
  authorize,
  AuthRequest,
} from "../middlewares/auth.middleware";

const router = Router();

// GET /api/reviews  (public)
router.get("/", async (req, res: Response) => {
  try {
    const reviews = await getAllReviews();
    res.json({
      success: true,
      message: "Reviews retrieved successfully",
      data: reviews,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch reviews" });
  }
});

// GET /api/reviews/:id  (public)
router.get("/:id", async (req, res: Response) => {
  try {
    const review = await getReviewById(Number(req.params.id));
    if (!review) {
      return res
        .status(404)
        .json({ success: false, message: "Review not found" });
    }
    res.json({
      success: true,
      message: "Review retrieved successfully",
      data: review,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch review" });
  }
});

// POST /api/reviews  (CUSTOMER only)
router.post(
  "/",
  authenticate,
  authorize("CUSTOMER"),
  async (req: AuthRequest, res: Response) => {
    try {
      const { rating, comment, serviceId } = req.body;
      if (!rating || !serviceId) {
        return res.status(400).json({
          success: false,
          message: "rating and serviceId are required",
        });
      }
      const review = await createReview({
        rating,
        comment,
        serviceId,
        customerId: req.user!.id,
      });
      res.status(201).json({
        success: true,
        message: "Review created successfully",
        data: review,
      });
    } catch (error) {
      res
        .status(400)
        .json({ success: false, message: "Could not create review" });
    }
  },
);

// PUT /api/reviews/:id
router.put(
  "/:id",
  authenticate,
  authorize("CUSTOMER"),
  async (req: AuthRequest, res: Response) => {
    try {
      const review = await updateReview(Number(req.params.id), req.body);
      res.json({
        success: true,
        message: "Review updated successfully",
        data: review,
      });
    } catch (error) {
      res.status(404).json({ success: false, message: "Review not found" });
    }
  },
);

// DELETE /api/reviews/:id  (soft delete)
router.delete("/:id", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const review = await softDeleteReview(Number(req.params.id));
    res.json({
      success: true,
      message: "Review deleted successfully",
      data: review,
    });
  } catch (error) {
    res.status(404).json({ success: false, message: "Review not found" });
  }
});

export default router;
