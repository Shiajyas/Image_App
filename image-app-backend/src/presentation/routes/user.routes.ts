import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const userController = new UserController();
const router = Router();

// POST /api/users/register
router.post("/register", (req, res) => userController.register(req, res));

// POST /api/users/login
router.post("/login", (req, res) => userController.login(req, res));

router.put("/change-password",authMiddleware,(req,res)=> userController.updatePassword(req, res))

router.get("/refresh-token",authMiddleware,(req,res)=> userController.refreshToken(req, res))

export default router;
