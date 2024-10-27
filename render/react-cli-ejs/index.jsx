function App() {
  return (
    <Themized>
      <Paper className="menu-top">
        <Link className="fx-brighthover-2 centerized" href="/">
          <img
            src={imgs.svg_logotext_banner_noslogan}
            style={{ width: "200px", objectFit: "contain" }}
            alt=""
          />
        </Link>
        <Typography variant="h4">RENDER-CLI</Typography>
      </Paper>
      <br />
      <Paper className="container">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "30px",
          }}
        >
          <Typography variant="h1">Bienvenido</Typography>
          <img
            src={imgs.imgB_logotext_banner_slogan}
            alt=""
            style={{
              width: "400px",
              objectFit: "contain",
            }}
          />
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
            <div className="gap-15px">
              <div className="jc-sp-bet gap-15px flex-wrap">
                <strong>Mensajería Instantánea:</strong> Envía y recibe mensajes
                en tiempo real con amigos y grupos.
              </div>
              <div className="jc-sp-bet gap-15px flex-wrap">
                <strong>Chats de Grupo:</strong> Crea grupos para conversaciones
                entre múltiples usuarios.
              </div>
              <div className="jc-sp-bet gap-15px flex-wrap">
                <strong>Mensajes Multimedia:</strong> Comparte fotos, videos,
                audios y GIFs de forma fácil y rápida.
              </div>
              <div className="jc-sp-bet gap-15px flex-wrap">
                <strong>Modo Oscuro:</strong> Mantén una apariencia más cómoda
                para los ojos en cualquier momento del día.
              </div>
            </div>
          </div>
        </Paper>
      </Paper>
    </Themized>
  );
}
