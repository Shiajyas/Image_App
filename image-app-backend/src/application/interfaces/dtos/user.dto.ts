export interface RegisterUserDTO {
  email: string;
  phone: string;
  password: string;
  avatar: string;
}

export interface LoginUserDTO {
  email: string;
  password: string;
}

export interface ResetPasswordDTO {
  userId: string;
  email: string;
  newPassword: string;
  oldPassword: string;
}

export interface UpdatePasswordDTO {
  oldPassword: string;
  newPassword: string;
}
