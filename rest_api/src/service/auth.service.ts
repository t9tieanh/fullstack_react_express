import ApiError from '../middleware/ApiError';
import User from '../models/User'
import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';

class AuthService {
    async login (email: string, password: string): Promise<{ token: string, message: string, user: { id: string, email: string, name: string } }> {
        try {
              const user = await User.findOne({ email });

              if (!user || !(await user.comparePassword(password))) {
                throw new ApiError(StatusCodes.BAD_REQUEST, 'Mật khẩu hoặc email không đúng !');
              }
            
              const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET!, { expiresIn: '7d' });

              return {
                token, 
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name
                }, 
                message: 'Đăng nhập thành công !'
              }
        } catch (e: any) {
            throw new ApiError(e.status || StatusCodes.INTERNAL_SERVER_ERROR, e.message || 'Đã xảy ra lỗi trong quá trình đăng nhập');
        }
    }
}

export default new AuthService();