import { User } from "../../domain/entities/User";
import {
  RegisterUserDTO,
  LoginUserDTO,
  ResetPasswordDTO,
} from "../interfaces/dtos/user.dto";

export class UserMapper {
  // Domain -> Response DTO
  static toResponse(user: User) {
    return {
      id: user._id,
      email: user.email,
      phone: user.phone,
      avatar: user.avatar,
    };
  }

  // Register DTO -> Domain
  static fromRegisterDTO(dto: RegisterUserDTO): User {
    return new User(
      "", // id will be set by DB
      dto.email,
      dto.phone,
      dto.password,
      dto.avatar
    );
  }

  // Login DTO -> Partial domain
  static fromLoginDTO(dto: LoginUserDTO): Partial<User> {
    return {
      email: dto.email,
      password: dto.password,
    };
  }

  // Reset password DTO -> Partial domain
  static fromResetPasswordDTO(dto: ResetPasswordDTO): Partial<User> {
    return {
      email: dto.email,
      password: dto.newPassword,
    };
  }
}
