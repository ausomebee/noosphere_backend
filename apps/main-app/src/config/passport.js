import session from "express-session";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

class PassportUtil {
  constructor(app) {
    this.app = app;
    this.initializeSession();
    this.configurePassport();
  }

  initializeSession() {
    this.app.use(
      session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
          maxAge: 1000 * 60 * 60 * 24,
        },
      })
    );
    this.app.use(passport.initialize());
    this.app.use(passport.session());
  }

  configurePassport() {
    passport.use(
      new GoogleStrategy(
        {
          clientID: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          callbackURL: "http://localhost:5000/auth/google/callback",
          scope: ["profile", "email"],
        },
        (accessToken, refreshToken, profile, callback) => {
          callback(null, profile)
        }
      )
    );

    passport.serializeUser((user, done) => done(null, user));

    passport.deserializeUser((user, done) => {
      done(null, user);
    });
  }
}

export default PassportUtil;