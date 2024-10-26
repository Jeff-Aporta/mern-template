import bcrypt from "bcryptjs"; // Importar bcrypt como módulo
import "../../../utils.js";

let basic; // Variable para el módulo básico
const TABLE = "users"; // Nombre de la tabla

// Crear un nuevo usuario
export async function create(user) {
  const pass = getCOL(user, "password");
  if (pass) {
    // Encriptar la contraseña antes de insertar el usuario
    setCOL(user, "password", await bcrypt.hash(pass, 10));
  }
  await basic.INSERT_OBJECT({
    TABLE,
    OBJECT: user,
  });
}

// Modificar un usuario (crea o actualiza si ya existe)
export async function modify(user) {
  await create(user);
}

// Leer un usuario por ID
export async function read(id) {
  const rows = await basic.READ_ROW({
    TABLE,
    ID: id,
  });
  if (rows.length > 0) {
    return rows[0]; // Devolver el usuario encontrado
  }
  return null; // Si no se encuentra el usuario
}

// Eliminar un usuario por ID
export async function remove(id) {
  await basic.DELETE_ROW({
    TABLE,
    ID: id,
  });
}

// Verificar si un usuario existe por ID
export async function exists(user) {
  return await basic.EXISTS({
    TABLE,
    ID: getCOL(user, "id"),
  });
}

// Verificar la contraseña de un usuario
export async function checkPassword(user, password) {
  const id = getCOL(user, "id");
  const _user = await read(id);
  if (!_user || !_user.password) {
    return false; // Usuario no encontrado o no tiene contraseña
  }
  return await bcrypt.compare(password, _user.password); // Comparar contraseñas
}

// Suspender un usuario
export async function suspend(user) {
  const id = getCOL(user, "id");
  const foundUser = await read(id);
  if (!foundUser) {
    throw new Error(`No se encontró el usuario con ID: ${id}`);
  }
  setCOL(foundUser, "suspended", true);
  await modify(foundUser); // Actualizar usuario con el estado suspendido
}

// Buscar un usuario por su nombre de usuario
export async function searchByUsername(username) {
  const query = `SELECT * FROM ${TABLE} WHERE username = '${username}';`;
  const rows = await basic.EXEC_QUERY({
    QUERY: query,
    MSG: `User found by username: ${username}`,
  });
  return rows.length > 0 ? rows[0] : null; // Devolver el usuario si existe, de lo contrario null
}

// Buscar un usuario por ID
export async function searchByID(id) {
  return await read(id); // Reutilizar la función read
}

// Obtener todos los usuarios
export async function get(user) {
  const id = getCOL(user, "id");
  const query = `SELECT * FROM ${TABLE} WHERE ID = ${id}`;
  return await basic.EXEC_QUERY({ QUERY: query, MSG: "All users retrieved" });
}

// Función para inicializar el módulo y crear la tabla si no existe
export async function init(_basic) {
  basic = _basic;

  // Crear la tabla "users" si no existe
  await basic.CREATE_TABLE({
    TABLE: "users",
    IDTYPE: "SERIAL", // IDs automáticos
  });
}

// Para exportar todas las funciones y la función de inicialización
export default {
  init,
  create,
  modify,
  read,
  remove,
  exists,
  checkPassword,
  suspend,
  searchByUsername,
  searchByID,
  get,
};
