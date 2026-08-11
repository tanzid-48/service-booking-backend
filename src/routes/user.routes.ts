import { Router, Response } from "express";
import {
  getAllUsers,
  getUserByIdForAdmin,
  updateUser,
  softDeleteUser,
} from "../services/user/user.service";
import {
  authenticate,
  authorize,
  AuthRequest,
} from "../middlewares/auth.middleware";

const router = Router();

// GET /api/users  (ADMIN only)
router.get(
  "/",
  authenticate,
  authorize("ADMIN"),
  async (req: AuthRequest, res: Response) => {
    try {
      const users = await getAllUsers();
      res.json({
        success: true,
        message: "Users retrieved successfully",
        data: users,
      });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Failed to fetch users" });
    }
  },
);

// GET /api/users/:id  (ADMIN only)
router.get(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  async (req: AuthRequest, res: Response) => {
    try {
      const user = await getUserByIdForAdmin(Number(req.params.id));
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }
      res.json({
        success: true,
        message: "User retrieved successfully",
        data: user,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch user" });
    }
  },
);

// PUT /api/users/:id  (ADMIN only)
router.put(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  async (req: AuthRequest, res: Response) => {
    try {
      const { name, phone, role } = req.body;
      const user = await updateUser(Number(req.params.id), {
        name,
        phone,
        role,
      });
      res.json({
        success: true,
        message: "User updated successfully",
        data: user,
      });
    } catch (error) {
      res.status(404).json({ success: false, message: "User not found" });
    }
  },
);

// DELETE /api/users/:id  (ADMIN only, soft delete)
router.delete(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  async (req: AuthRequest, res: Response) => {
    try {
      const user = await softDeleteUser(Number(req.params.id));
      res.json({
        success: true,
        message: "User deleted successfully",
        data: user,
      });
    } catch (error) {
      res.status(404).json({ success: false, message: "User not found" });
    }
  },
);

export default router;
