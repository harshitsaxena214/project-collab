import mongoose from "mongoose";
import { Note } from "../models/noteModels.js";
import { Project } from "../models/projectModels.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";

const getNotes = async (req, res) => {
  const { projectId } = req.params;
  const project = await Project.findById(projectId);

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  const notes = await Note.find({
    project: new mongoose.Types.ObjectId(projectId),
  }).populate("createdBy", " username fullname avatar");

  return res
    .status(200)
    .json(new ApiResponse(200, notes, "Notes fetched Successfully"));
};

const getNoteById = async (req, res) => {
  const { noteId } = req.params;

  const note = await Note.findById(noteId).populate(
    "createdBy",
    "username fullname avatar",
  );

  if (!note) {
    throw new ApiError(404, "Note not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, note, "Note fetched Successfully"));
};

const createNote = async (req, res) => {
  const { projectId } = req.params;
  const { content } = req.body || {};

  const project = await Project.findById(projectId);

  if (!project) {
    throw new ApiError(404, "Project Not Found");
  }

  const note = await Note.create({
    project: new mongoose.Types.ObjectId(projectId),
    content,
    createdBy: new mongoose.Types.ObjectId(req.user._id),
  });

  const populatedNote = await Note.findById(note._id).populate(
    "createdBy",
    "username fullname avatar",
  );

  return res
    .status(200)
    .json(new ApiResponse(200, populatedNote, "Note Created Successfully"));
};

const updateNote = async (req, res) => {
  const { noteId } = req.params;
  const { content } = req.body;

  const existingNote = Note.findById(noteId);
  if (!existingNote) {
    throw new ApiError(404, "Note not found");
  }

  const updatedNote = await Note.findByIdAndUpdate(
    noteId,
    { content },
    { new: true },
  ).populate("createdBy", "username fullname avatar");

  return res
    .status(200)
    .json(new ApiResponse(200, updatedNote, "Note Updated Successfully"));
};

const deleteNote = async (req, res) => {
  const { noteId } = req.params;
  const existingNote = Note.findById(noteId);

  if (!existingNote) {
    throw new ApiError(404, "Note not found");
  }
  const deletedNote = await Note.findByIdAndDelete(noteId);

  return res
    .status(200)
    .json(new ApiResponse(200, deletedNote, "Note deleted Successfully"));
};

export { createNote, getNotes, getNoteById, deleteNote, updateNote };
