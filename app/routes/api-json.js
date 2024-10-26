export default ({ app }) => {
  app.get("/api-json", (req, res) => {
    res.json({ status: "OK", message: "¡Hola desde el backend!" });
  });

  app.get("/api-json/:cmdjson", (req, res) => {
    res.json({
      status: "OK",
      message: "¡Estas intentando correr un comando JSON!",
      cmd: req.params["cmdjson"],
    });
  });
};
