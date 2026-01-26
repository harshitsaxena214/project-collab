import { User } from "../models/userModels.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";
import { userRegistrationValidator } from "../validators/index.js";

const registerUser = asyncHandler(async (req, res) => {
  const { email, username, password, role } = req.body || {};
  userRegistrationValidator(body);
  const existingUser = await User.findOne({ email });
  if(existingUser)
  {
     return ApiResponse()
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body || {};
});

const logoutUser = asyncHandler(async (req, res) => {
  const { email, username, password, role } = req.body || {};
});

const verifyEmail = asyncHandler(async (req, res) => {
  const { email, username, password, role } = req.body || {};
});

const resendVerificationEmail = asyncHandler(async (req, res) => {
  const { email, username, password, role } = req.body || {};
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const { email, username, password, role } = req.body || {};
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email, username, password, role } = req.body || {};
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { email, username, password, role } = req.body || {};
});

const getCurrentUser = asyncHandler(async (req, res) => {
  const { email, username, password, role } = req.body || {};
});

export { registerUser };
