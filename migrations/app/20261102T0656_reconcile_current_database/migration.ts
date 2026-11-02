#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/bcd47c406662190325c3ec8005f3f8c988c2d4867ca2e9181f0eda2b93c29400/contract';
import endContract from '../../snapshots/bcd47c406662190325c3ec8005f3f8c988c2d4867ca2e9181f0eda2b93c29400/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/ca49982968c10475d61c7a63717c6b309e07b2533e21891f1b39b1fea016c812/contract';
import startContract from '../../snapshots/ca49982968c10475d61c7a63717c6b309e07b2533e21891f1b39b1fea016c812/contract.json' with { type: 'json' };
import {
  Migration,
  MigrationCLI,
  checkExpression,
  col,
  fn,
  lit,
  primaryKey,
  sql,
} from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createTable({
        schema: 'public',
        table: 'panitia_accounts',
        columns: [
          col('created_at', 'timestamptz', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('id', 'uuid', {
            notNull: true,
            default: fn(sql`gen_random_uuid()`),
            codecRef: { codecId: 'pg/uuid@1' },
          }),
          col('is_active', 'bool', {
            notNull: true,
            default: lit(true),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('nama', 'character varying(100)', {
            notNull: true,
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 100 } },
          }),
          col('password_hash', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('role', 'character varying(20)', {
            notNull: true,
            default: lit('SCANNER'),
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 20 } },
          }),
          col('username', 'character varying(50)', {
            notNull: true,
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 50 } },
          }),
        ],
        constraints: [
          primaryKey(['id'], { name: 'panitia_accounts_pkey' }),
          checkExpression(
            'panitia_accounts_role_check',
            sql`((role)::text = ANY ((ARRAY['ADMIN'::character varying, 'SCANNER'::character varying])::text[]))`,
          ),
        ],
      }),
      this.addColumn({
        schema: 'public',
        table: 'DataLomba',
        column: col('checkedInBy', 'uuid', { codecRef: { codecId: 'pg/uuid@1' } }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'DataLomba',
        column: col('paymentLinkCreatedAt', 'timestamptz', {
          codecRef: { codecId: 'pg/timestamptz-string@1' },
        }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'DataLomba',
        column: col('paymentLinkStatus', 'text', {
          notNull: true,
          default: lit('NOT_CREATED'),
          codecRef: { codecId: 'pg/text@1' },
        }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'DataLomba',
        column: col('paymentUrl', 'text', { codecRef: { codecId: 'pg/text@1' } }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'DataLomba',
        column: col('paymentWhatsAppSentAt', 'timestamptz', {
          codecRef: { codecId: 'pg/timestamptz-string@1' },
        }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'DataLomba',
        column: col('snapToken', 'text', { codecRef: { codecId: 'pg/text@1' } }),
      }),
      this.addUnique({
        schema: 'public',
        table: 'panitia_accounts',
        constraint: 'panitia_accounts_username_key',
        columns: ['username'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'panitia_accounts',
        index: 'panitia_accounts_username_lower_idx',
        expression: sql`lower(username::text)`,
        extras: { unique: true },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'DataLomba',
        foreignKey: {
          name: 'DataLomba_checkedInBy_fkey',
          columns: ['checkedInBy'],
          references: { schema: 'public', table: 'panitia_accounts', columns: ['id'] },
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
