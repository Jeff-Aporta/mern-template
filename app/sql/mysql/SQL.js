let connection;

async function CREATE_DATABASE({ DATABASE }) {
  DATABASE = global.snake_case(DATABASE);
  const query = `CREATE DATABASE IF NOT EXISTS ${DATABASE}`;
  await EXEC_QUERY({
    QUERY: query,
    MSG: `Database created or already exists ${DATABASE}`,
  });
}

async function CREATE_TABLE({ TABLE, IDTYPE = "INT AUTO_INCREMENT" }) {
  TABLE = global.global.snake_case(TABLE);
  const query = `
      CREATE TABLE IF NOT EXISTS ${TABLE} (
        ID ${IDTYPE} PRIMARY KEY
      );
  `;
  await EXEC_QUERY({ QUERY: query, MSG: `Table created, ${TABLE}` });
}

function CHANGE_DATABASE({ DATABASE }) {
  connection.changeUser({ database: DATABASE }, (err) => {
    if (err) {
      throw err;
    }
  });
}

async function EXEC_QUERY({ QUERY, MSG }) {
  try {
    const results = await new Promise((resolve, reject) => {
      connection.query(QUERY, (err, results) => {
        if (err) {
          return reject(err);
        }
        resolve(results);
      });
    });
    const data = JSON.parse(JSON.stringify(results))[0];
    return data
  } catch (err) {
    throw err;
  }
}

export default (_con) => {
  connection = _con;
  return {
    CREATE_DATABASE,
    CREATE_TABLE,
    CHANGE_DATABASE,
    EXEC_QUERY,
  };
};
