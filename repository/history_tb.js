// table in sql server database
const sql = require('mssql');
const readYamlFile = require('read-yaml-file');

let dbConfig = readYamlFile.sync('./scripts/db_config.yaml');
const sqlConfig = {
  user: dbConfig.username,
  password: dbConfig.password,
  database: dbConfig.database,
  server: dbConfig.server,
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  },
  options: {
    encrypt: false, 
    trustServerCertificate: false
  }
}

const getAllHistoryQuery = `SELECT [timestamp], [content], [owner_id] from [history]`;
const insertRowQuery = `INSERT INTO [history]([owner_id], [content])  VALUES  (@ownerId, @content)`;

class HistoryTb {
    constructor(){
      // this.config = config;
      this.pool = null;
    }

    async NewClient(){
        this.pool = await sql.connect(sqlConfig);
        sql.on('error', (err) => {
          console.error("new client is in error | ", err)
        }) 
    }

    async GetAllHistory(){
      let result = await this.pool.request().query(getAllHistoryQuery);
      return result.recordset
    }

    async InsertRow(username, content){
      await this.pool.request()
        .input("ownerId", sql.NVarChar, username)
        .input("content", sql.NVarChar, content)
        .query(insertRowQuery);
    }
}

module.exports = { HistoryTb }
