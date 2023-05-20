import * as mysql from 'mysql2/promise';

const dbTestConfig = {
  host: '127.0.0.1',
  password: 'root',
  port: 3306,
  user: 'root',
};

const executeQuery = async (query: string) => {
  const connection = await mysql.createConnection(dbTestConfig);
  connection
    .execute(query)
    .then(console.log)
    .catch(console.error)
    .finally(() => connection.end());
};

const createDatabase = async (name: string) => {
  executeQuery(`CREATE DATABASE IF NOT EXISTS ${name}`)
    .then(console.log)
    .catch(console.error);
};

const dropDatabase = async (name: string) => {
  await executeQuery(`DROP DATABASE ${name}`)
    .then(console.log)
    .catch(console.error);
};

interface Options {
  dbName: string;
}

export const setupTestCase = async ({ dbName }: Options) => {
  await createDatabase(dbName).then(() => {
    console.log(`db ${dbName} created`);
  });
};

export const testCaseDestroy = async ({ dbName }: Options) => {
  await dropDatabase(dbName).then(() => {
    console.log(`db ${dbName} dropped`);
  });
};
