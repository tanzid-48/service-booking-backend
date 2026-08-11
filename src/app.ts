import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import categoryRoutes from "./routes/category.routes";
import { authenticate, AuthRequest } from "./middlewares/auth.middleware";
import serviceRoutes from './routes/service.routes';

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ success: true, message: "Service Booking API is running!" });
});

app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use('/api/services', serviceRoutes);

app.get("/api/profile", authenticate, (req: AuthRequest, res) => {
  res.json({
    success: true,
    message: "This is a protected route",
    data: req.user,
  });
});

export default app;
