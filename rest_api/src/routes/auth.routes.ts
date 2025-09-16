import { Router } from 'express';
import {
  register, verifyRegisterOtp,
  login, forgotPassword, resetPasswordWithOtp
} from '../controllers/auth.controller';
import validateDto from '../middleware/validateDto.midleware';
import { RegisterDto, OtpVerifyDto, ForgotDto, LoginDto, ResetWithOtpDto } from '../dto/request/auth.dto';

const router = Router();

// Đăng ký + OTP
router.post('/register', validateDto(RegisterDto), register);
router.post('/register/verify-otp', validateDto(OtpVerifyDto), verifyRegisterOtp);

// Đăng nhập
router.post('/login', validateDto(LoginDto), login);

// Quên mật khẩu + OTP
router.post('/forgot-password', validateDto(ForgotDto), forgotPassword);
router.post('/reset-password-otp', validateDto(ResetWithOtpDto), resetPasswordWithOtp);

export default router;
