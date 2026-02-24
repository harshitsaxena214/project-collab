import { User } from "../models/userModels.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";
import { sendMail } from "../utils/mail.js";
import { userRegistrationValidator } from "../validators/index.js";

const registerUser = asyncHandler(async (req, res) => {
  const { email, username, password, fullname } = req.body;

  const existingUser = await User.findOne({ $or: [{ email }, { username }] });
  if (existingUser) throw new ApiError(409, "User with email or username already exists");

  const user = await User.create({ username, email, password, fullname });

  // Generate email verification token
  const { hashedToken, unHashedToken, tokenExpiry } = user.generateTemporaryToken();

  user.emailVerificationToken = hashedToken;
  user.emailVerificationExpiry = tokenExpiry;
  await user.save({ validateBeforeSave: false });

  // Send verification email
  await sendMail({
    email: user.email,
    subject: "Verify your email",
    mailGenContent: emailVerificationMailGenContent(
      user.username,
      `${process.env.BASE_URL}/api/users/verify-email/${unHashedToken}`,
    ),
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken -emailVerificationToken -emailVerificationExpiry",
  );

  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User registered successfully. Please verify your email."));
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
