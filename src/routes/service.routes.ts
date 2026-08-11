import { Router, Response } from "express";
import {
  createService,
  getAllServices,
  getServiceById,
  updateService,
  softDeleteService,
} from "../services/service/service.service";
import {
  authenticate,
  authorize,
  AuthRequest,
} from "../middlewares/auth.middleware";

const router = Router();

// GET /api/services  (public)
router.get("/", async (req, res: Response) => {
  try {
    const services = await getAllServices();
    res.json({
      success: true,
      message: "Services retrieved successfully",
      data: services,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch services" });
  }
});

// GET /api/services/:id  (public)
router.get("/:id", async (req, res: Response) => {
  try {
    const service = await getServiceById(Number(req.params.id));
    if (!service) {
      return res
        .status(404)
        .json({ success: false, message: "Service not found" });
    }
    res.json({
      success: true,
      message: "Service retrieved successfully",
      data: service,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch service" });
  }
});

// POST /api/services  (PROVIDER only)
router.post(
  "/",
  authenticate,
  authorize("PROVIDER", "ADMIN"),
  async (req: AuthRequest, res: Response) => {
    try {
      const { title, description, price, categoryId } = req.body;
      if (!title || !price || !categoryId) {
        return res.status(400).json({
          success: false,
          message: "title, price and categoryId are required",
        });
      }
      const service = await createService({
        title,
        description,
        price,
        categoryId,
        providerId: req.user!.id, // login করা provider এর id নিজেই বসবে
      });
      res.status(201).json({
        success: true,
        message: "Service created successfully",
        data: service,
      });
    } catch (error) {
      res
        .status(400)
        .json({ success: false, message: "Could not create service" });
    }
  },
);

// PUT /api/services/:id  (PROVIDER/ADMIN only)
router.put(
  "/:id",
  authenticate,
  authorize("PROVIDER", "ADMIN"),
  async (req: AuthRequest, res: Response) => {
    try {
      const service = await updateService(Number(req.params.id), req.body);
      res.json({
        success: true,
        message: "Service updated successfully",
        data: service,
      });
    } catch (error) {
      res.status(404).json({ success: false, message: "Service not found" });
    }
  },
);

// DELETE /api/services/:id  (PROVIDER/ADMIN only, soft delete)
router.delete(
  "/:id",
  authenticate,
  authorize("PROVIDER", "ADMIN"),
  async (req: AuthRequest, res: Response) => {
    try {
      const service = await softDeleteService(Number(req.params.id));
      res.json({
        success: true,
        message: "Service deleted successfully",
        data: service,
      });
    } catch (error) {
      res.status(404).json({ success: false, message: "Service not found" });
    }
  },
);

export default router;
