import { Request, Response } from "express";
import { container } from "../../di/container";
import { RegisterUserUseCase } from "../../application/use-cases/user/register-user.usecase";
import { LoginUserUseCase } from "../../application/use-cases/user/login-user.usecase";
import { ResetPasswordUseCase } from "../../application/use-cases/user/reset-password.usecase";
import { HTTP_STATUS, MESSAGES } from "../../infrastructure/utils/constants";

export class UserController {
  
  async register(req: Request, res: Response) {
    try {
      const usecase = container.resolve(RegisterUserUseCase);
      const result = await usecase.execute(req.body);

      return res.status(HTTP_STATUS.CREATED).json({
        success: true,
        message: MESSAGES.USER.REGISTER_SUCCESS,
        data: result,
      });

    } catch (err: any) {
      console.error("Register Error:", err);

      return res.status(err.status || 400).json({
        success: false,
        message: err.message || MESSAGES.ERROR.SERVER,
      });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const usecase = container.resolve(LoginUserUseCase);
      const result = await usecase.execute(req.body);

      return res.status(HTTP_STATUS.OK).json({
        success: true,
        message: MESSAGES.USER.LOGIN_SUCCESS,
        data: result,
      });

    } catch (err: any) {
      console.error("Login Error:", err);

      return res.status(err.status || 401).json({
        success: false,
        message: err.message || MESSAGES.USER.LOGIN_FAILED,
      });
    }
  }

  async updatePassword(req: Request, res: Response) {
    try {
      const usecase = container.resolve(ResetPasswordUseCase);
      const result = await usecase.execute(req.body);

      return res.status(HTTP_STATUS.OK).json({
        success: true,
        message: MESSAGES.USER.PASSWORD_RESET_SUCCESS,
        data: result,
      });

    } catch (err: any) {
      console.error("Password Update Error:", err);

      return res.status(err.status || 400).json({
        success: false,
        message: err.message || MESSAGES.ERROR.SERVER,
      });
    }
  }
}
