import { Router, Response } from "express";
import {
  createBooking,
  getAllBookings,
  getBookingById,
  updateBooking,
  updateBookingStatus,
  softDeleteBooking,
} from "../services/booking/booking.service";
import {
  authenticate,
  authorize,
  AuthRequest,
} from "../middlewares/auth.middleware";

const router = Router();

// GET /api/bookings  (logged-in user)
router.get("/", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const bookings = await getAllBookings();
    res.json({
      success: true,
      message: "Bookings retrieved successfully",
      data: bookings,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch bookings" });
  }
});

// GET /api/bookings/:id
router.get("/:id", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const booking = await getBookingById(Number(req.params.id));
    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }
    res.json({
      success: true,
      message: "Booking retrieved successfully",
      data: booking,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch booking" });
  }
});

// POST /api/bookings  (CUSTOMER only)
router.post(
  "/",
  authenticate,
  authorize("CUSTOMER"),
  async (req: AuthRequest, res: Response) => {
    try {
      const { bookingDate, serviceId } = req.body;
      if (!bookingDate || !serviceId) {
        return res.status(400).json({
          success: false,
          message: "bookingDate and serviceId are required",
        });
      }
      const booking = await createBooking({
        bookingDate: new Date(bookingDate),
        serviceId,
        customerId: req.user!.id,
      });
      res.status(201).json({
        success: true,
        message: "Booking created successfully",
        data: booking,
      });
    } catch (error) {
      res
        .status(400)
        .json({ success: false, message: "Could not create booking" });
    }
  },
);
// PUT /api/bookings/:id  (general update — CUSTOMER who owns it)
router.put(
  "/:id",
  authenticate,
  authorize("CUSTOMER"),
  async (req: AuthRequest, res: Response) => {
    try {
      const { bookingDate } = req.body;
      const booking = await updateBooking(Number(req.params.id), {
        bookingDate: bookingDate ? new Date(bookingDate) : undefined,
      });
      res.json({
        success: true,
        message: "Booking updated successfully",
        data: booking,
      });
    } catch (error) {
      res.status(404).json({ success: false, message: "Booking not found" });
    }
  },
);

// PUT /api/bookings/:id/status  (PROVIDER/ADMIN only - confirm/complete/cancel)
router.put(
  "/:id/status",
  authenticate,
  authorize("PROVIDER", "ADMIN"),
  async (req: AuthRequest, res: Response) => {
    try {
      const { status } = req.body;
      const booking = await updateBookingStatus(Number(req.params.id), status);
      res.json({
        success: true,
        message: "Booking status updated successfully",
        data: booking,
      });
    } catch (error) {
      res.status(404).json({ success: false, message: "Booking not found" });
    }
  },
);

// DELETE /api/bookings/:id  (soft delete)
router.delete("/:id", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const booking = await softDeleteBooking(Number(req.params.id));
    res.json({
      success: true,
      message: "Booking deleted successfully",
      data: booking,
    });
  } catch (error) {
    res.status(404).json({ success: false, message: "Booking not found" });
  }
});

export default router;
