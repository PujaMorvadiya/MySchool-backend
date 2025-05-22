/* eslint-disable @typescript-eslint/no-explicit-any */
import { Strategy } from 'passport-jwt';
import { Request } from 'express';
import { JWT_SECRET } from '../config';
// import User from '../models/user.model';

const getToken: any = (req: Request) => {
  return req.headers['authorization'].replace('JWT ', '');
};
const options: { jwtFromRequest: ReturnType<typeof getToken>; secretOrKey: string } = {
  jwtFromRequest: getToken,
  secretOrKey: `${JWT_SECRET}`,
};
const auth = (passport: any) => {
  passport.use(
    new Strategy(options, async (jwt_payload, done) => {
      try {
        const user = await User.findOne(jwt_payload.userId);
        if (user) {
          return done(null, user);
        } else {
          return done(null, false), jwt_payload;
        }
      } catch (error) {
        return done(error);
      }
    }),
  );
};

export { auth, getToken };
