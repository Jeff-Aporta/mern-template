import pg from "pg";  // Importar el módulo pg completo

const { Pool } = pg;  // Desestructurar Pool de pg


async function CREATE_DATABASE({ DATABASE }) {
  if (process.env.connectionString) {
    // Está en producción
    return;
  }
  DATABASE = global.snake_case(DATABASE);
  const query = `SELECT 1 FROM pg_database WHERE datname='${DATABASE}'`;
  const result = await global.mypgsql.query(query);

  if (result.rows.length === 0) {
    await global.mypgsql.query(`CREATE DATABASE ${DATABASE}`);
    console.log(`Database created: ${DATABASE}`);
  } else {
    console.log(`Database already exists: ${DATABASE}`);
  }
}

async function CREATE_TABLE({ TABLE, IDTYPE = "SERIAL" }) {
  TABLE = global.snake_case(TABLE);
  const query = `CREATE TABLE IF NOT EXISTS ${TABLE} (ID ${IDTYPE} PRIMARY KEY);`;
  await EXEC_QUERY({ QUERY: query, MSG: `Table created or already exists: ${TABLE}` });
}

function CHANGE_DATABASE({ DATABASE }) {
  if (process.env.connectionString) {
    global.mypgsql = new Pool({
      connectionString: process.env.connectionString,
    });
  } else {
    global.mypgsql = new Pool({
      user: process.env.user,
      host: process.env.host,
      database: process.env.db,
      password: process.env.password,
      port: 5432,
    });
  }

  console.log(`Connected to database: ${DATABASE}`);
}

async function EXEC_QUERY({ QUERY, MSG }) {
  console.log(`Executing query: ${QUERY}`);
  try {
    const results = await global.mypgsql.query(QUERY);
    console.log(MSG);
    return results.rows;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

async function CHECK_TABLE_EXISTS({ TABLE }) {
  TABLE = global.snake_case(TABLE); // Convierte el nombre de la tabla a snake_case
  const query = `
    SELECT EXISTS (
      SELECT 1
      FROM pg_tables
      WHERE schemaname = 'public' AND tablename = '${TABLE}'
    );
  `;
  const result = await EXEC_QUERY({
    QUERY: query,
    MSG: `Checked if table exists: ${TABLE}`,
  });

  return result[0].exists; // Devuelve true si la tabla existe, de lo contrario false
}

export default function () {
  return {
    CREATE_DATABASE,
    CREATE_TABLE,
    CHANGE_DATABASE,
    CHECK_TABLE_EXISTS,
    EXEC_QUERY,
  };
}
