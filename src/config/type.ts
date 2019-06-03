import Email from './email/type';
export interface Config {
  SSL: boolean;
  PORT: number;
  HOST: string;
  EMAIL_VERIFICATION_SECRET: string;
  PHONE_NO_VERIFICATION_SECRET: string;
  JWT_SECRET: string;
  // email: Email;
}
