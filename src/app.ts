import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import { authenticate, AuthRequest } from './middlewares/auth.middleware';


const app = express();

app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Service Booking API is running!",
  });
});

// Routes
app.use("/api/auth", authRoutes);
app.get("/api/profile", authenticate, (req: AuthRequest, res) => {
  res.json({
    success: true,
    message: "This is a protected route",
    data: req.user,
  });
});

export default app;
