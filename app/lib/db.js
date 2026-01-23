import mysql from 'mysql2/promise'

const pool = mysql.createPool({
    host: "193.203.166.208",
    user: "u706648698_review_gen_db",
    password: "2NeB3$eX&",
    database: "u706648698_review_gen_db",
    waitForConnections: true,
    port: 3306,
    multipleStatements: true
})

export default pool;