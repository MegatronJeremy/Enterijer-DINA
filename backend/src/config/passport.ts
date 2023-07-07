import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import User, { IUser } from "../models/user";
import config from "../config/database";

export default function (passport: any) {
  const opts: any = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.secret,
  };

  passport.use(
    new JwtStrategy(opts, async (jwtPayload, done) => {
      try {
        const user: IUser | null = await User.getUserById(jwtPayload.id);

        if (user) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      } catch (err) {
        return done(err, false);
      }
    })
  );
}
