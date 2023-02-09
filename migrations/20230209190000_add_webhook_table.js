'use strict'

exports.up = async (knex) => {
    await knex.schema.createTable('webhook', (t) => {
        t.uuid('id').default(knex.raw('uuid_generate_v4()')).primary()
        t.text('body').notNullable()
        t.text('headers').notNullable()
        t.timestamps(false, true)
    })
}

exports.down = async function down(knex) {
    await knex.schema.dropTable('users')
}
