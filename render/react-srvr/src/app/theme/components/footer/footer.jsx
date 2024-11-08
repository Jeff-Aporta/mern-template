import Typography from "@mui/material/Typography";
import { Paper } from "@mui/material";

export default PieDePagina;

function PieDePagina() {
  return (
    <Paper elevation={0} className="content-container padh-40px min-h-30vh footer">
        <strong className="c-deepskyblue">
          <big>&copy; {new Date().getFullYear()} Cattleya Software</big>
        </strong>
      <p>Soluciones de software que crecen contigo.</p>
    </Paper>
  );
}
