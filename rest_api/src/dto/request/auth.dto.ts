import { IsEmail, IsString, MinLength, Length } from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: "Email không hợp lệ" })
  email?: string;

  @IsString({ message: "Tên không hợp lệ" })
  @MinLength(2, { message: "Tên tối thiểu 2 ký tự" })
  name?: string;

  @IsString({ message: "Mật khẩu không hợp lệ" })
  @MinLength(6, { message: "Mật khẩu phải từ 6 ký tự" })
  password?: string;
}

// Các class khác cũng sửa tương tự:
export class LoginDto {
  @IsEmail({}, { message: "Email không hợp lệ" })
  email?: string;

  @IsString({ message: "Mật khẩu không hợp lệ" })
  @MinLength(6, { message: "Mật khẩu phải từ 6 ký tự" })
  password?: string;
}

export class OtpVerifyDto {
  @IsEmail()
  email?: string;

  @IsString()
  @Length(6, 6, { message: "OTP phải gồm 6 số" })
  otp?: string;
}

export class ForgotDto {
  @IsEmail()
  email?: string;
}

export class ResetWithOtpDto {
  @IsEmail({}, { message: "Email không hợp lệ" })
  email?: string;

  @IsString()
  @Length(6, 6, { message: "OTP phải gồm 6 số" })
  otp?: string;

  @IsString({ message: "Mật khẩu mới không hợp lệ" })
  @MinLength(6, { message: "Mật khẩu mới phải từ 6 ký tự" })
  newPassword?: string;
}