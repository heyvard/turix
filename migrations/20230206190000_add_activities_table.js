'use strict'

exports.up = async (knex) => {
    await knex.schema.createTable('activities', (t) => {
        t.uuid('id').default(knex.raw('uuid_generate_v4()')).primary()
        t.text('user_id').index().notNullable()
        t.text('activity_id').unique().notNullable()
        t.text('name').notNullable()
        t.double('distance').nullable()
        t.integer('moving_time').nullable()
        t.integer('elapsed_time').nullable()
        t.double('total_elevation_gain').nullable()
        t.timestamp('start_date').nullable()
        t.text('type1').nullable()
        t.text('sport_type').nullable()
        t.text('map_summary_polyline').nullable()
        t.text('raw_json').notNullable()
        t.timestamps(false, true)
    })
}

exports.down = async function down(knex) {
    await knex.schema.dropTable('users')
}
