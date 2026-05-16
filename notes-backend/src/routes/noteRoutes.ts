import express from "express";

import {
  createNote,
  getMyNotes,
  getNoteById,
  updateNote,
  deleteNote,
  shareNote,
  togglePinNote,
  toggleLockNote,
  searchNotes,
} from "../controllers/noteController";

import { authenticateUser } from "../middleware/authMiddleware";

const router = express.Router();


router.get(
  "/notes",
  authenticateUser,
  getMyNotes
);
router.get(
  "/notes/:id",
  authenticateUser, 
  getNoteById);
router.post(
  "/notes",
  authenticateUser,
  createNote
);
router.put(
  "/notes/:id",
  authenticateUser,
  updateNote
);
router.delete(
  "/notes/:id",
  authenticateUser,
  deleteNote
);
router.post(
  "/notes/:id/share",
  authenticateUser,
  shareNote
);
router.patch(
  "/notes/:id/pin",
  authenticateUser,
  togglePinNote
);
router.patch(
  "/notes/:id/lock",
  authenticateUser,
  toggleLockNote
);
router.get(
  "/search",
  authenticateUser,
  searchNotes
);
export default router;