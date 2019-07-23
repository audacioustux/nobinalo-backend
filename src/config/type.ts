export default interface Config {
    SSL: boolean;
    NODE_ENV: string;
    PORT: number;
    HOST: string;
    EMAIL_VERIFICATION_SECRET: string;
    PHONE_NO_VERIFICATION_SECRET: string;
    JWT_SECRET: string;
}
