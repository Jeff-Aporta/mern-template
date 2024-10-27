function App() {
  return (
    <Themized>
      <Paper className="menu-top">
        <img src={imgs.svg_logotext_banner_noslogan} width="200" alt="" />
        <Button size="small" variant="contained" color="atentionGreen">
          Botón
        </Button>
      </Paper>
      <br />
      <Paper className="container">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "30px",
          }}
        >
          <Typography variant="h1">Bienvenido</Typography>
          <img src={imgs.imgB_logotext_banner_slogan} width="400" alt="" />
        </div>
        <br />
        <hr />
        <br />
        <br />
        <Typography>
          ChatterBox, una innovadora aplicación de mensajería diseñada para
          conectar a las personas mediante una comunicación fluida y en tiempo
          real. Con ChatterBox, puedes disfrutar de chats instantáneos,
          compartir multimedia y mantener conversaciones grupales, todo en una
          interfaz intuitiva y amigable.
        </Typography>
        <br />
        <Paper
          className="container"
          elevation={4}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "30px",
          }}
        >
          <img
            src={imgs.imgB_apppromo}
            width="250"
            alt=""
            style={{
              borderRadius: "20px",
            }}
          />
          <div>
            <Typography variant="h3">Características Principales</Typography>
            <ul>
              <li>
                <strong>Mensajería Instantánea:</strong> Envía y recibe mensajes
                en tiempo real con amigos y grupos.
              </li>
              <li>
                <strong>Chats de Grupo:</strong> Crea grupos para conversaciones
                entre múltiples usuarios.
              </li>
              <li>
                <strong>Mensajes Multimedia:</strong> Comparte fotos, videos,
                audios y GIFs de forma fácil y rápida.
              </li>
              <li>
                <strong>Modo Oscuro:</strong> Mantén una apariencia más cómoda
                para los ojos en cualquier momento del día.
              </li>
            </ul>
          </div>
        </Paper>
      </Paper>
    </Themized>
  );
}
