export interface Profile {
  username: string;
  email: string;
  uuid: string;
}
export interface SignupPayload {
  username: string;
  password1: string;
  password2: string;
  email: string;
}
export interface Email {
  email: string;
}
export interface ForgotPassword {
  uid: string;
  token: string;
  new_password1: string;
  new_password2: string;
}
export interface LoginPayload {
  password: string;
  email: string;
}
export interface GoogleLoginPayload {
  access_token: string;
  id_token: string;
}

export interface LoginResponse {
  token: string;
  user: Profile;
}

export interface UsersPayload {
  key: string;
  _id: string;
  index: number;
  email: string;
  name: string;
  password: string;
}
export interface ClientPayload {
  id: number;
  user: number;
  schema_name: string;
  uuid: string;
  paid_until: string;
  created_on: string;
  active: boolean;
}
