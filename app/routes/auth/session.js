import session from "express-session";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import passport from "passport";

import RedisStore from "connect-redis";
import redisClient from "./redis-client.js";

import { Strategy as LocalStrategy } from "passport-local";

// Configuración del middleware
const urlencodedParser = bodyParser.urlencoded({ extended: false });

// Función para inicializar la sesión y la estrategia de Passport
const initializePassport = (app, pg) => {
  app.use(urlencodedParser);
  app.use(cookieParser("clave"));

  app.use(
    session({
      store: new RedisStore({ client: redisClient }),
      secret: "tu_secreto",
      resave: false,
      saveUninitialized: true,
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(
      {
        usernameField: "username",
        passwordField: "pwrd",
      },
      async (username, pwrd, done) => {
        try {
          // Aquí realizarías una consulta real en la base de datos
          let user = { username, pwrd }; // Cambia por la consulta real
          if (!user) {
            return done(null, false, { message: "Usuario no encontrado" });
          }
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      // Realiza aquí la búsqueda real del usuario por ID en la base de datos
      let user = { id: "test", name: "test", password: "test" }; // Cambia esto por tu lógica
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
};

// Función para definir las rutas de autenticación
const defineAuthRoutes = (app) => {
  app.get("/userlog/end", (req, res) => {
    req.logout((err) => {
      if (err) {
        console.error("Error en logout:", err);
        return res.status(500).send("Error en logout");
      }
      res.redirect("/");
    });
  });

  app.post(
    "/userlog/start",
    passport.authenticate("local", {
      successRedirect: "/",
      failureRedirect: "/login",
    })
  );
};

// Exporta la función que inicializa Passport y las rutas
const authModule = ({ app, pg }) => {
  initializePassport(app, pg);
  defineAuthRoutes(app);
};

export default authModule;
