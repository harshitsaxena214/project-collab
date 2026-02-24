import asyncHandler from "../utils/async-handler.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { Project } from "../models/projectModels.js";
import { ProjectMember } from "../models/projectmemberModels.js";
import { User } from "../models/userModels.js";

const getProjects = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const projects = await Project.find({
    $or: [
      { createdBy: new mongoose.Types.ObjectId(userId) },
      {
        _id: { $in: await ProjectMember.distinct("project", { user: userId }) },
      },
    ],
  }).populate("createdBy", "username fullname avatar");

  return res
    .status(200)
    .json(new ApiResponse(200, projects, "Projects fetched successfully"));
});

const getProjectById = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const project = await Project.findById(projectId).populate(
    "createdBy",
    "username fullname avatar",
  );

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, project, "Project fetched Successfully"));
});

const createProject = asyncHandler(async (req, res) => {
  const { name, description } = req.body || {};
  const user = req.user._id;

  const project = await Project.create({
    name,
    description: description || "",
    createdBy: new mongoose.Types.ObjectId(user),
  });

  await ProjectMember.create({
    project: project._id,
    user: req.user._id,
    role: UserRolesEnum.ADMIN,
  });
  return res
    .status(201)
    .json(new ApiResponse(201, project, "Project created successfully"));
});

const updateProject = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { name, description } = req.body;

  const existingProject = Project.findById(projectId);
  if (!existingProject) {
    throw new ApiError(404, "Project not found");
  }

  const updatedProject = await Project.findByIdAndUpdate(
    projectId,
    { name, description },
    { new: true },
  ).populate("createdBy", "username fullname avatar");

  return res
    .status(200)
    .json(new ApiResponse(200, updatedProject, "Project Updated Successfully"));
});

const deleteProject = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  const project = await Project.findByIdAndDelete(projectId);
  if (!project) throw new ApiError(404, "Project not found");

  await ProjectMember.deleteMany({ project: projectId });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Project deleted successfully"));
});

const addProjectMember = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { email, role = UserRolesEnum.MEMBER } = req.body;

  const project = await Project.findById(projectId);
  if (!project) throw new ApiError(404, "Project not found");

  const user = await User.findOne({ email });
  if (!user) throw new ApiError(404, "User not found");

  const existingMember = await ProjectMember.findOne({
    project: projectId,
    user: user._id,
  });
  if (existingMember)
    throw new ApiError(409, "User is already a member of this project");

  const member = await ProjectMember.create({
    project: projectId,
    user: user._id,
    role,
  });
  await member.populate("user", "username fullname avatar email");

  return res
    .status(201)
    .json(new ApiResponse(201, member, "Member added successfully"));
});

const getProjectMembers = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const project = await Project.findById(projectId);
  if (!project) throw new ApiError(404, "Project not found");
  const members = await ProjectMember.find({
    project: new mongoose.Types.ObjectId(projectId),
  }).populate("user", "username fullname avatar email");
  return res
    .status(200)
    .json(new ApiResponse(200, members, "Members fetched successfully"));
});

const updateMemberRole = asyncHandler(async (req, res) => {
  const { projectId, memberId } = req.params;
  const { role } = req.body;

  const member = await ProjectMember.findOneAndUpdate(
    { project: projectId, user: memberId },
    { $set: { role } },
    { new: true },
  ).populate("user", "username fullname avatar email");

  if (!member) throw new ApiError(404, "Member not found in this project");

  return res
    .status(200)
    .json(new ApiResponse(200, member, "Member role updated successfully"));
});

const deleteProjectMember = asyncHandler(async (req, res) => {
  const { projectId, memberId } = req.params;

  const member = await ProjectMember.findOneAndDelete({
    project: projectId,
    user: memberId,
  });

  if (!member) throw new ApiError(404, "Member not found in this project");

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Member removed successfully"));
});

export {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  addProjectMember,
  getProjectMembers,
  updateMemberRole,
  deleteProjectMember,
};
