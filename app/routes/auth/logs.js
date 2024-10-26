import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import session from "express-session";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";

// Configuración del middleware
const urlencodedParser = bodyParser.urlencoded({ extended: false });

// Función para inicializar la sesión y la estrategia de Passport
const initializePassport = (app, pg) => {
  app.use(urlencodedParser);
  app.use(cookieParser("clave"));

  app.use(
    session({
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
          let user = { username, pwrd }; // Consulta a la base de datos
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
      // Aquí deberías realizar la búsqueda del usuario por ID
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
    req.logout();
    res.redirect("/");
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
