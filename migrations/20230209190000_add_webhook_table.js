'use strict'

exports.up = async (knex) => {
    await knex.schema.createTable('activities', (t) => {
        t.uuid('id').default(knex.raw('uuid_generate_v4()')).primary()
        t.text('raw_json').notNullable()
        t.timestamps(false, true)
    })
}

exports.down = async function down(knex) {
    await knex.schema.dropTable('users')
}
