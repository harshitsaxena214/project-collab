import { Router } from "express";
import { registerUser } from "../controllers/authControllers.js";
import { validate } from "../middlewares/validatorMiddleware.js";
import { userRegistrationValidator } from "../validators/index.js";

const router = Router();

router.post("/register", userRegistrationValidator(), validate, registerUser);

export default router;