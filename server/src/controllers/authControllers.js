import { User } from "../models/userModels.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";
import { sendMail } from "../utils/mail.js";
import { userRegistrationValidator } from "../validators/index.js";

const registerUser = asyncHandler(async (req, res) => {
  const { email, username, password, fullname } = req.body || {};
  userRegistrationValidator(req.body);
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return ApiResponse(400, { message: "User already Exists" });
  }
  const user = new User({ username, email, password, fullname });

  user.save();
  sendMail(
    user.email,
    (mailGenContent = emailVerificationMailGenContent(username)),
  );
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body || {};
  const user = await User.findOne({ email });
  if (!user) {
    return ApiResponse(400, { message: "Invalid email or password" });
  }
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    return ApiResponse(400, { message: "Invalid email or password" });
  }
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });
  return ApiResponse(200, { accessToken });
});

const logoutUser = asyncHandler(async (req, res) => {
  const { email, username, password, role } = req.body || {};

  res.clearCookie("refreshToken");
  return ApiResponse(200, { message: "Logged out successfully" });
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

export {
  registerUser,
  loginUser,
  logoutUser,
  verifyEmail,
  resendVerificationEmail,
  refreshAccessToken,
  forgotPassword,
  changeCurrentPassword,
  getCurrentUser,
};
