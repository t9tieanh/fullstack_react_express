import User from '../models/User'
import { RegisterDto, OtpVerifyDto } from '../dto/request/auth.dto'
import ApiError from '../middleware/ApiError'
import { StatusCodes } from 'http-status-codes'
import { OTPUtil, OtpValidationReason } from '../utils/otp.utils'
import nodemailService from './nodemail.service'
import redisService from './redis.service'
import { EmailTypeEnum } from '../enums/emailType.enum'
import { NotificationDto } from '../dto/request/notification.dto';

class UserService {
    async signUp(data: RegisterDto): Promise<{ message: string }> {
        try {
            const exists = await User.findOne({ email: data.email });
            if (exists)
                throw new ApiError(StatusCodes.BAD_REQUEST, 'Email đã tồn tại');

            // save in redis
            const otp = OTPUtil.create(6);
            await redisService.set(`user:register:${data.email}`, { ...data, otp }, 300);

            await nodemailService.sendMail({
                type: EmailTypeEnum.VERIFY_EMAIL,
                email: [data.email],
                token: otp.code,
                name: data.name
            } as NotificationDto)

            return { message: 'Đăng ký thành công. Vui lòng kiểm tra email để xác thực.' };
        } catch (error: any) {
            console.log(error);
            throw new ApiError(error.status || StatusCodes.INTERNAL_SERVER_ERROR, error.message || 'Đã xảy ra lỗi trong quá trình đăng ký');
        }
    }

    async verifyUserByOtp({ email, otp }: OtpVerifyDto): Promise<{ message: string; user: { email: string } }> {
        try {
            const pendingUser = await redisService.get(`user:register:${email}`);
            // -> trường hợp không có otp trong db redis
            if (!pendingUser)
                throw new ApiError(StatusCodes.BAD_REQUEST, 'Mã otp đã hết hạn, xin vui lòng đăng ký lại !')

            // validate otp
            const result = OTPUtil.validate(pendingUser.otp, otp as string)
            if (!result.success) {
                // Validate không thành công ⇒ đã tăng otp.attempts trong OTPUtil.validate()

                // 1) Tính TTL còn lại (giây)
                const elapsedSecond = (Date.now() - new Date(pendingUser.otp.createdAt).getTime()) / 1000
                const remainingSec = Math.max(0, OTPUtil.OTP_TTL_SECONDS - elapsedSecond)

                // 2) Chỉ update nếu còn TTL
                if (remainingSec > 0) {
                    // Ghi lại session vào Redis với TTL mới (làm tròn lên)
                    await redisService.set(`user:register:${email}`, pendingUser, Math.ceil(remainingSec))
                }

                // if max attem
                if (result.reason == OtpValidationReason.MaxAttemptsExceeded) {
                    await redisService.del(`user:register:${email}`);
                    throw new ApiError(StatusCodes.UNAUTHORIZED, result.reason)
                }

                throw new ApiError(StatusCodes.BAD_REQUEST, result.reason)
            }

            // Nếu OTP hợp lệ, xóa OTP khỏi Redis
            await redisService.del(`user:register:${email}`);

            // save in db
            const user = await User.create({ ...pendingUser, isVerified: true });

            return { message: 'Xác thực thành công.', user: { email: user.email } };
        } catch (error: any) {
            console.log(error);
            throw new ApiError(error.status || StatusCodes.INTERNAL_SERVER_ERROR, error.message || 'Đã xảy ra lỗi trong quá trình đăng ký');
        }
    }

    async forgetPassword (email: string): Promise<{ message: string }> {
        try {
            const exists = await User.findOne({ email: email });
            if (!exists)
                throw new ApiError(StatusCodes.BAD_REQUEST, 'Không tìm thấy người dùng !');

            // save in redis
            const otp = OTPUtil.create(6);
            await redisService.set(`user:forget-password:${email}`, { email, otp }, 300);

            await nodemailService.sendMail({
                type: EmailTypeEnum.FORGOT_PASSWORD_OTP,
                email: [email],
                token: otp.code,
                name: exists.name
            } as NotificationDto)

            return { message: 'Đăng ký thành công. Vui lòng kiểm tra email để xác thực.'};
        } catch (e: any) {
            console.log(e);
            throw new ApiError(e.status || StatusCodes.INTERNAL_SERVER_ERROR, e.message || 'Đã xảy ra lỗi trong quá trình quên mật khẩu');
        }
    }

    async resetPassword (data: OtpVerifyDto & { newPassword: string }): Promise<{ message: string }> {
        try {
            const pendingUser = await redisService.get(`user:forget-password:${data.email}`);
            // -> trường hợp không có otp trong db redis
            if (!pendingUser)
                throw new ApiError(StatusCodes.BAD_REQUEST, 'Mã otp đã hết hạn, xin vui lòng thử lại !')

            // validate otp
            const result = OTPUtil.validate(pendingUser.otp, data.otp as string)
            if (!result.success) {
                // if max attem
                if (result.reason == OtpValidationReason.MaxAttemptsExceeded) {
                    await redisService.del(`user:forget-password:${data.email}`);
                    throw new ApiError(StatusCodes.UNAUTHORIZED, result.reason)
                }

                // 1) Tính TTL còn lại (giây)
                const elapsedSecond = (Date.now() - new Date(pendingUser.otp.createdAt).getTime()) / 1000
                const remainingSec = Math.max(0, OTPUtil.OTP_TTL_SECONDS - elapsedSecond)

                // 2) Chỉ update nếu còn TTL
                if (remainingSec > 0) {
                    // Ghi lại session vào Redis với TTL mới (làm tròn lên)
                    await redisService.set(`user:forget-password:${data.email}`, pendingUser, Math.ceil(remainingSec))
                }

                throw new ApiError(StatusCodes.BAD_REQUEST, result.reason)
            }

            // Nếu OTP hợp lệ, xóa OTP khỏi Redis
            await redisService.del(`user:forget-password:${data.email}`);

            // tiến hành update password
            await User.updateOne({ email: data.email }, { password: data.newPassword });
            return { message: 'Đặt lại mật khẩu thành công.' };

        } catch (e: any) {
            console.log(e);
            throw new ApiError(e.status || StatusCodes.INTERNAL_SERVER_ERROR, e.message || 'Đã xảy ra lỗi trong quá trình đặt lại mật khẩu');
        }
    }
}

export default new UserService()