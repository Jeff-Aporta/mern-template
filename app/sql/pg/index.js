import pg from "pg";
import { exit } from "process";
import PG from "./PG.js";
import TABLE from "./TABLE.js";
import usersModule from "./entity/users.js";

const { Pool, Client } = pg;

const test = !global.runPrototypes;

(async () => {
  try {
    if (process.env.connectionString) {
      global.mypgsql = new Pool({
        connectionString: process.env.connectionString,
      });
    } else {
      global.mypgsql = new Client({
        host: process.env.host,
        user: process.env.user,
        password: process.env.password,
        port: 5432,
      });
      await global.mypgsql.connect();
    }

    await CREATE_DATABASE({ DATABASE: process.env.db });
    await CHANGE_DATABASE({ DATABASE: process.env.db });
    console.log("PostgreSQL Connected!");
  } catch (error) {
    console.error("Error conectando a PostgreSQL:", error);
  }
})();

const PGInstance = PG();
const TABLEInstance = TABLE(PGInstance);

const { CREATE_DATABASE, CREATE_TABLE, CHANGE_DATABASE, EXEC_QUERY } =
  PGInstance;
const {
  GET_COLUMNS,
  GET_COLUMNS_TYPE,
  ADD_COLUMN,
  INSERT_OBJECT,
  EXISTS,
  CALC_TYPE,
  DELETE_ROW,
  READ_ROW,
} = TABLEInstance;

const basic = {
  CREATE_DATABASE,
  CREATE_TABLE,
  CHANGE_DATABASE,
  EXEC_QUERY,
  DELETE_ROW,
  GET_COLUMNS,
  READ_ROW,
  GET_COLUMNS_TYPE,
  ADD_COLUMN,
  INSERT_OBJECT,
  EXISTS,
  CALC_TYPE,
};

const users = usersModule;

export default { ...basic, users };

(async () => {
  try {
    if (test) {
      await _test_();
      setTimeout(() => {
        console.log("Prueba terminada");
        global.mypgsql.end();
        exit(1);
      }, 1000);
    }
  } catch (err) {
    console.error("Error en la prueba:", err);
  } finally {
    if (global.mypgsql) {
      global.mypgsql.end();
    }
  }
})();

async function _test_() {
  try {
    await users.create({ username: "jeff123", password: "34" });
  } catch (error) {
    console.error("Error creando usuario:", error);
  }
}
