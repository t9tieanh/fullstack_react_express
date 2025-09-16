import { Request, Response } from 'express';
import authService from '../service/auth.service';
import { asyncHandler } from '../utils/asyncHandler';
import userService from '../service/user.service'
import sendResponse from '../dto/response/send-response';
import { StatusCodes } from 'http-status-codes';

export const register = asyncHandler(async (req: Request, res: Response) => {
  const result = await userService.signUp(req.data)
  sendResponse(res, {
    code: StatusCodes.OK,
    message: result.message,
    result: result
  })
});

export const verifyRegisterOtp = asyncHandler(async (req: Request, res: Response) => {
  const { email, otp } = req.data;
  const result = await userService.verifyUserByOtp({ email, otp })
  sendResponse(res, {
    code: StatusCodes.OK,
    message: result.message,
    result: { email: result.user.email }
  });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.data;
  const result = await authService.login(email, password)
  sendResponse(res, {
    code: StatusCodes.OK,
    message: result.message,
    result: result
  })
});

// Quên mật khẩu: gửi OTP
export const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.data;

  const result = await userService.forgetPassword(email)
  sendResponse(res, {
    code: StatusCodes.OK,
    message: result.message,
    result: result
  })
});

// Đặt lại mật khẩu bằng OTP
export const resetPasswordWithOtp = asyncHandler(async (req: Request, res: Response) => {
  const { email, otp, newPassword } = req.data;

  const result = await userService.resetPassword({ email, otp, newPassword })
  sendResponse(res, {
    code: StatusCodes.OK,
    message: result.message,
    result: result
  })
});
