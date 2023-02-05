module.exports = {
    client: 'cockroachdb',
    connection: process.env.PG_URI,
    migrations: {
        directory: './migrations',
    },
}
