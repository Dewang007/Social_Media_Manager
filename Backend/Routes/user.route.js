import { Router } from "express";
import { createUser, login, logout } from "../Controllers/user.controller.js";
import { verifyJwt } from "../Middlewares/jwt.middleware.js";
const router = Router();

router.route("/register").post(createUser);
router.route("/login").post(login);
router.route("/logout").post(verifyJwt, logout);

export default router;
