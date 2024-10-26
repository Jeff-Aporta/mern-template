export default ({ app, server }) => {
  app.get("/app-control/warn-danger/stop/:secretkey", (req, res) => {
    res.send("Server stopped, tu clave secreta es: " + req.params.secretkey);
    setTimeout(() => {
      server.close();
      process.exit();
    }, 1000);
  });
};
