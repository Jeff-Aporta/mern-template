import Typography from "@mui/material/Typography";
import { Paper } from "@mui/material";

export default PieDePagina;

function PieDePagina() {
  return (
    <>
      <br />
      <Paper
        elevation={0}
        className="pad-40px min-h-30vh d-flex gap-20px flex-wrap jc-sb"
      >
        <Columna title="Pie de página" content="Contenido..." />
        <Columna title="Redes sociales" content="Contenido..." />
      </Paper>
    </>
  );

  function Columna({ title, content }) {
    return (
      <div>
        <Paper elevation={1} className="d-flex-col pad-10px gap-20px ai-c">
          <div>
            <Typography variant="h4">{title}</Typography>
            <hr className="op-30" />
            <br />
            <Typography>{content}</Typography>
          </div>
        </Paper>
      </div>
    );
  }
}
