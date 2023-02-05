'use strict'

exports.up = async (knex) => {
    await knex.schema.createTable('users', (t) => {
        t.uuid('id').default(knex.raw('uuid_generate_v4()')).primary()
        t.string('firebase_user_id').unique().notNullable()
        t.string('picture').nullable()
        t.string('email').unique().notNullable()
        t.string('name').notNullable()
        t.boolean('admin').notNullable()
        t.string('athlete_id').unique().nullable()
        t.string('access_token').nullable()
        t.string('refresh_token').nullable()
        t.integer('expires_at').nullable()
        t.timestamps(false, true)
    })
}

exports.down = async function down(knex) {
    await knex.schema.dropTable('users')
}
