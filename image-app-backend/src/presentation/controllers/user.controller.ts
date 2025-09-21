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

      res.status(HTTP_STATUS.CREATED).json({
        success: true,
        message: MESSAGES.USER.REGISTER_SUCCESS,
        data: result,
      });
    } catch (err) {
      console.error("UserController.register error:", err);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: MESSAGES.ERROR.SERVER,
        error: err,
      });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const usecase = container.resolve(LoginUserUseCase);
      const result = await usecase.execute(req.body);

      console.log(result, "result");

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: MESSAGES.USER.LOGIN_SUCCESS,
        data: result,
      });
    } catch (err) {
      console.error("UserController.login error:", err);
      res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: MESSAGES.USER.LOGIN_FAILED,
        error: err,
      });
    }
  }

  async updatePassword(req: Request, res: Response) {
    try {
      const usecase = container.resolve(ResetPasswordUseCase);
      const result = await usecase.execute(req.body);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: MESSAGES.USER.PASSWORD_RESET_SUCCESS,
        data: result,
      });
    } catch (err) {
      console.error("UserController.updatePassword error:", err);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: MESSAGES.ERROR.SERVER,
        error: err,
      });
    }
  }
}
