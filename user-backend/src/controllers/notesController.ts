import { Request, Response } from "express";
import { Note } from "../models/note";

export const getNotes = async (req: Request, res: Response): Promise<void> => {
  try {
    const notes = await Note.find({ userId: req.user!._id });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: "Error fetching notes" });
  }
};

export const createNote = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { title, description } = req.body;
    const note = new Note({
      title,
      description,
      userId: req.user!._id,
    });
    await note.save();
    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ message: "Error creating note" });
  }
};

export const updateNote = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, description, status } = req.body;

    const note = await Note.findOne({ _id: id, userId: req.user!._id });
    if (!note) {
      res.status(404).json({ message: "Note not found" });
      return;
    }

    if (title) note.title = title;
    if (description) note.description = description;
    if (status) note.status = status;

    await note.save();
    res.json(note);
  } catch (error) {
    res.status(500).json({ message: "Error updating note" });
  }
};

export const deleteNote = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const note = await Note.findOneAndDelete({
      _id: id,
      userId: req.user!._id,
    });

    if (!note) {
      res.status(404).json({ message: "Note not found" });
      return;
    }

    res.json({ message: "Note deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting note" });
  }
};
