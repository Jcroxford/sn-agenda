
exports.up = function(knex) {
  return knex.schema.createTable('todos', (table) => {
    table.increments()
    table.string('text').notNullable()
    table.boolean('completed').notNullable().defaultTo(false)
    table.boolean('deleted').notNullable().defaultTo(false)
    table.string('user_id').notNullable()
    table.string('username').notNullable()
    table.string('channel_id').notNullable()
    table.string('channel_name').notNullable()
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
  })
}

exports.down = function(knex) {
  return knex.schema.dropTable('todos')
}
