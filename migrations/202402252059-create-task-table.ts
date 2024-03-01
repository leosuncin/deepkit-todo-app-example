import { Migration } from '@deepkit/sql';

/**
 * Schema migration created automatically. You should commit this into your Git repository.
 *
 * You can rename and modify this file as you like, but make sure that 'databaseName' and 'created' are not modified.
 */
export class SchemaMigration implements Migration {
  /**
   * The migration name/title. Defaults to the file name, but can be overwritten here and to give a nice explanation what has been done.
   */
  name = `Create task table`;

  /**
   * Database name used for this migration. Should usually not be changed.
   * If you change your database names later, you can adjust those here as well to make sure
   * migration files are correctly assigned to the right database connection.
   *
   * Used adapter: "sqlite"
   */
  databaseName = 'default';

  /**
   * This version should not be changed since it is used to detect if this migration
   * has been already executed against the database.
   *
   * This version was created at 2024-02-26T02:59:15.605Z.
   */
  version = 1708916355;

  /**
   * SQL queries executed one by one, to apply a migration.
   */
  up() {
    return [
      `PRAGMA foreign_keys = OFF`,
      `CREATE TABLE "tasks" (
            "id" varchar(32) PRIMARY KEY NOT NULL DEFAULT (lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6)))),
            "title" text NOT NULL,
            "completed" integer(1) NOT NULL DEFAULT (0)
          )`,
      `PRAGMA foreign_keys = ON`,
    ];
  }

  /**
   * SQL queries executed one by one, to revert a migration.
   */
  down() {
    return [`DROP TABLE "tasks"`];
  }
}
