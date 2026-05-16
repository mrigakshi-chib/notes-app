import { Response } from "express";

import prisma from "../prisma/client";

import { AuthRequest } from "../middleware/authMiddleware";
import bcrypt from "bcrypt";

export const createNote = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { title, content } = req.body;

    // Validation
    if (!title || !content) {
      return res.status(400).json({
        message: "Title and content are required",
      });
    }

    // Get authenticated user ID
    const userId = req.user?.userId;

    // Create note
    const note = await prisma.note.create({
      data: {
        title,
        content,
        ownerId: userId!,
      },
    });

    return res.status(201).json({
      message: "Note created successfully",
      note,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
export const getMyNotes = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.user?.userId;

    // Pagination values
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;

    const skip = (page - 1) * limit;

    // Fetch notes
    const notes = await prisma.note.findMany({
      where: {
        OR: [

          // Owned notes
          {
            ownerId: userId,
          },

          // Shared notes
          {
            sharedWith: {
              some: {
                userId: userId,
              },
            },
          },
        ],
      },

  include: {
    sharedWith: true,

    owner: {
      select: {
        email: true,
      },
    },
  },
});

    // Total count
    const totalNotes = await prisma.note.count({
      where: {
        ownerId: userId,
      },
    });
    const formattedNotes = notes.map((note) => {
      if (note.isLocked) {
        return {
          ...note,
          content: "This note is locked",
        };
      }

      return note;
    });
    return res.status(200).json({
      currentPage: page,
      totalPages: Math.ceil(totalNotes / limit),
      totalNotes,
      notes: formattedNotes,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
export const updateNote = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const noteId = req.params.id as string;

    const { title, content } = req.body;

    const userId = req.user?.userId;

    // Find note
    const existingNote = await prisma.note.findUnique({
      where: {
        id: noteId,
      },
    });

    // Note not found
    if (!existingNote) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    // Ownership check
    if (existingNote.ownerId !== userId) {
      return res.status(403).json({
        message: "Forbidden",
      });
    }

    // Update note
    const updatedNote = await prisma.note.update({
      where: {
        id: noteId,
      },
      data: {
        title,
        content,
      },
    });

    return res.status(200).json({
      message: "Note updated successfully",
      updatedNote,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
export const deleteNote = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const noteId = req.params.id as string;

    const userId = req.user?.userId;

    // Find note
    const existingNote = await prisma.note.findUnique({
      where: {
        id: noteId,
      },
    });

    // Note not found
    if (!existingNote) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    // Ownership check
    if (existingNote.ownerId !== userId) {
      return res.status(403).json({
        message: "Forbidden",
      });
    }

    // Delete note
    await prisma.note.delete({
      where: {
        id: noteId,
      },
    });

    return res.status(200).json({
      message: "Note deleted successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
export const shareNote = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const noteId = req.params.id as string;

    const { email } = req.body;

    const userId = req.user?.userId;

    // Validate email
    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    // Find note
    const note = await prisma.note.findUnique({
      where: {
        id: noteId,
      },
    });

    // Note not found
    if (!note) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    // Ownership check
    if (note.ownerId !== userId) {
      return res.status(403).json({
        message: "Forbidden",
      });
    }

    // Find target user
    const targetUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!targetUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Prevent sharing with self
    if (targetUser.id === userId) {
      return res.status(400).json({
        message: "You already own this note",
      });
    }

    // Check existing share
    const existingShare =
      await prisma.sharedNote.findUnique({
        where: {
          noteId_userId: {
            noteId,
            userId: targetUser.id,
          },
        },
      });

    if (existingShare) {
      return res.status(409).json({
        message: "Note already shared with this user",
      });
    }

    // Create share
    await prisma.sharedNote.create({
      data: {
        noteId,
        userId: targetUser.id,
      },
    });

    return res.status(200).json({
      message: "Note shared successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
export const togglePinNote = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const noteId = req.params.id as string;

    const userId = req.user?.userId;

    // Find note
    const existingNote = await prisma.note.findUnique({
      where: {
        id: noteId,
      },
    });

    // Note not found
    if (!existingNote) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    // Ownership check
    if (existingNote.ownerId !== userId) {
      return res.status(403).json({
        message: "Forbidden",
      });
    }

    // Toggle pin status
    const updatedNote = await prisma.note.update({
      where: {
        id: noteId,
      },
      data: {
        isPinned: !existingNote.isPinned,
      },
    });

    return res.status(200).json({
      message: updatedNote.isPinned
        ? "Note pinned successfully"
        : "Note unpinned successfully",
      note: updatedNote,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
export const toggleLockNote = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const noteId = req.params.id as string;

    const { pin } = req.body;

    const userId = req.user?.userId;

    // Validate pin
    if (!pin) {
      return res.status(400).json({
        message: "PIN is required",
      });
    }

    // Find note
    const existingNote = await prisma.note.findUnique({
      where: {
        id: noteId,
      },
    });

    // Note not found
    if (!existingNote) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    // Ownership check
    if (existingNote.ownerId !== userId) {
      return res.status(403).json({
        message: "Forbidden",
      });
    }

    // If note is already locked -> unlock it
    if (existingNote.isLocked) {
      const isPinCorrect = await bcrypt.compare(
        pin,
        existingNote.lockPin as string
      );

      if (!isPinCorrect) {
        return res.status(401).json({
          message: "Incorrect PIN",
        });
      }

      const unlockedNote = await prisma.note.update({
        where: {
          id: noteId,
        },
        data: {
          isLocked: false,
          lockPin: null,
        },
      });

      return res.status(200).json({
        message: "Note unlocked successfully",
        note: unlockedNote,
      });
    }

    // Lock note
    const hashedPin = await bcrypt.hash(pin, 10);

    const lockedNote = await prisma.note.update({
      where: {
        id: noteId,
      },
      data: {
        isLocked: true,
        lockPin: hashedPin,
      },
    });

    return res.status(200).json({
      message: "Note locked successfully",
      note: lockedNote,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
export const searchNotes = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const query = req.query.q as string;

    const userId = req.user?.userId;

    // Validate query
    if (!query) {
      return res.status(400).json({
        message: "Search query is required",
      });
    }

    // Search notes
    const notes = await prisma.note.findMany({
      where: {
        ownerId: userId,
        OR: [
          {
            title: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            content: {
              contains: query,
              mode: "insensitive",
            },
          },
        ],
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      notes,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};