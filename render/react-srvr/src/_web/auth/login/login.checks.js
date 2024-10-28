import { toast } from "react-hot-toast";

function enter() {
  toast.error("Implementar función de entrada", { position: "bottom-right" });
}

function checkPassword() {
  toast.error("Implementar función de verificación de contraseña", {
    position: "bottom-right",
  });
}

function checkUser() {
  toast.error("Implementar función de verificación de usuario", {
    position: "bottom-right",
  });
}

export { enter, checkPassword, checkUser };
