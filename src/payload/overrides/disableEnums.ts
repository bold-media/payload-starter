import { PostgresSchemaHook } from '@payloadcms/drizzle/postgres'

export const disableEnums: PostgresSchemaHook = ({ schema, adapter }) => {
  for (const tableName in adapter.rawTables) {
    const table = adapter.rawTables[tableName]

    for (const fieldName in table.columns) {
      const column = table.columns[fieldName]

      if (column.type === 'enum') {
        ;(column as any).type = 'varchar'
      }
    }
  }
  return schema
}
