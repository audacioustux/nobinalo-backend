import { Router } from 'express';
// import emailAuthRoutes from './email';
// import githubAuthRoutes from './github';
import logoutRoutes from './logout';

const authRouter = Router();

// authRouter.use('/email', emailAuthRoutes);
// authRouter.use('/github', githubAuthRoutes);
authRouter.use('/logout', logoutRoutes);

export default authRouter;
