import { Router } from "express";
import { AvailableUserRoles, UserRolesEnum } from "../utils/constants.js";
import { validateProjectPermission } from "../middlewares/authMiddleware.js";
import {
  createNote,
  getNoteById,
  getNotes,
  updateNote,
} from "../controllers/noteControllers.js";

const router = Router();

router
  .route("/:projectId")
  .get(validateProjectPermission(AvailableUserRoles), getNotes)
  .post(
    validateProjectPermission([UserRolesEnum.ADMIN, UserRolesEnum.MEMBER]),
    createNote,
  );
router
  .route("/:projectId/n/:noteId")
  .get(validateProjectPermission(AvailableUserRoles), getNoteById)
  .put(validateProjectPermission([UserRolesEnum.ADMIN]), updateNote)
  .delete(validateProjectPermission([UserRolesEnum.ADMIN]), deleteNote);

export default router;
