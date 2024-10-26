let EXEC_QUERY;
let CREATE_TABLE;

async function GET_COLUMNS({ TABLE }) {
  if (!TABLE) {
    throw "Debes especificar la tabla";
  }
  TABLE = snake_case(TABLE);
  const query = `SELECT column_name FROM information_schema.columns WHERE table_name = '${TABLE}'`;
  const results = await global.mypgsql.query(query);
  const columnNames = results.rows.map((column) =>
    snake_case(column.column_name)
  );
  return columnNames;
}

async function GET_COLUMNS_TYPE({ TABLE }) {
  if (!TABLE) {
    throw "Debes especificar la tabla";
  }
  TABLE = snake_case(TABLE);
  const query = `SELECT column_name, data_type FROM information_schema.columns WHERE table_name = '${TABLE}'`;
  const results = await global.mypgsql.query(query);
  const retorno = {};
  results.rows.forEach((column) => {
    retorno[column.column_name] = column.data_type.toUpperCase();
  });
  return retorno;
}

async function ADD_COLUMN({ TABLE, COLUMN, TYPE }) {
  TABLE = snake_case(TABLE);
  COLUMN = snake_case(COLUMN);
  const columns = await GET_COLUMNS({ TABLE });
  if (columns.includes(COLUMN)) {
    console.log(`Column ${COLUMN} already exists in ${TABLE}`);
    return;
  }
  const query = `ALTER TABLE ${TABLE} ADD COLUMN ${COLUMN} ${TYPE}`;
  await EXEC_QUERY({
    QUERY: query,
    MSG: `Column added to ${TABLE}: ${COLUMN} ${TYPE}`,
  });
}

async function INSERT_OBJECT({ TABLE, OBJECT }) {
  if (!TABLE || !OBJECT) {
    throw "Faltan datos para insertar objeto";
  }
  TABLE = snake_case(TABLE);
  CREATE_TABLE({ TABLE });
  const columns = await GET_COLUMNS({ TABLE });
  for (let k of Object.keys(OBJECT)) {
    k = snake_case(k);
    if (!columns.includes(k)) {
      let type = CALC_TYPE({ DATA: OBJECT[k] });
      await ADD_COLUMN({ TABLE, COLUMN: k, TYPE: type });
    }
  }
  const exists = await EXISTS({
    TABLE,
    ID: getCOL(OBJECT, "id"),
  });
  const query = await (async () => {
    if (exists) {
      const types = await GET_COLUMNS_TYPE({ TABLE });
      return `UPDATE ${TABLE} SET ${Object.keys(OBJECT)
        .map((key) => {
          const K = snake_case(key);
          let V = getCOL(OBJECT, key);
          if (types[K] && types[K].includes("TEXT")) {
            V = `'${V.toString()}'`;
          }
          return `${K} = ${V}`;
        })
        .join(", ")} WHERE ID = ${getCOL(OBJECT, "id")}`;
    }
    return `INSERT INTO ${TABLE} (${Object.keys(OBJECT)
      .map((k) => snake_case(k))
      .join(", ")}) VALUES (${Object.values(OBJECT)
      .map((k) =>
        CALC_TYPE({ DATA: k }).includes("TEXT") ? `'${k.toString()}'` : k
      )
      .join(", ")});`;
  })();
  await EXEC_QUERY({ QUERY: query, MSG: `Object inserted into ${TABLE}` });
}

async function EXISTS({ ID, TABLE }) {
  if (!ID) {
    return false; // No hay ID para comparar
  }
  if (!TABLE) {
    throw "Falta tabla para validar existencia";
  }
  TABLE = snake_case(TABLE);
  const query = `SELECT 1 FROM ${TABLE} WHERE id = ${ID} LIMIT 1`;
  const results = await global.mypgsql.query(query);
  return results.rowCount > 0;
}

function CALC_TYPE({ DATA }) {
  switch (typeof DATA) {
    case "number":
      return "FLOAT";
    case "object":
      // Verificamos si DATA es una instancia de Date
      if (DATA instanceof Date) {
        return "TIMESTAMP";
      }
      return "TEXT";
    default:
      return "TEXT";
  }
}

async function DELETE_ROW({ TABLE, ID }) {
  if (!TABLE || !ID) {
    throw "Faltan datos para borrar fila";
  }
  TABLE = snake_case(TABLE);
  const query = `DELETE FROM ${TABLE} WHERE ID = ${ID};`;
  await EXEC_QUERY({
    QUERY: query,
    MSG: `Row deleted in ${TABLE} with ID ${ID}`,
  });
}

async function READ_ROW({ TABLE, ID }) {
  const query = `SELECT * FROM ${TABLE} WHERE ID = ${ID};`;
  return await EXEC_QUERY({
    QUERY: query,
    MSG: `Row read in ${TABLE} with ID ${ID}`,
  });
}

export default (PG) => {
  EXEC_QUERY = PG.EXEC_QUERY;
  CREATE_TABLE = PG.CREATE_TABLE;
  return {
    GET_COLUMNS,
    GET_COLUMNS_TYPE,
    ADD_COLUMN,
    INSERT_OBJECT,
    EXISTS,
    CALC_TYPE,
    DELETE_ROW,
    READ_ROW,
  };
};
