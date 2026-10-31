#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/26c4a9cdfe767c5518742dcdaba378a49b34fcf77ce24feff576d20381ad2268/contract';
import startContract from '../../snapshots/26c4a9cdfe767c5518742dcdaba378a49b34fcf77ce24feff576d20381ad2268/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/ca49982968c10475d61c7a63717c6b309e07b2533e21891f1b39b1fea016c812/contract';
import endContract from '../../snapshots/ca49982968c10475d61c7a63717c6b309e07b2533e21891f1b39b1fea016c812/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, lit } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.addColumn({
        schema: 'public',
        table: 'DataLomba',
        column: col('jumlahBayar', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'DetailFunRun',
        column: col('buktiKartuPelajarPath', 'text', { codecRef: { codecId: 'pg/text@1' } }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'DetailFunRun',
        column: col('kategoriPeserta', 'text', {
          notNull: true,
          default: lit('EXTERNAL'),
          codecRef: { codecId: 'pg/text@1' },
        }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'DetailFunRun',
        column: col('kelas', 'text', { codecRef: { codecId: 'pg/text@1' } }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'DetailFunRun',
        column: col('paymentExpiresAt', 'timestamptz', {
          codecRef: { codecId: 'pg/timestamptz-temporal@1' },
        }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'DetailFunRun',
        column: col('statusVerifikasi', 'text', {
          notNull: true,
          default: lit('NOT_REQUIRED'),
          codecRef: { codecId: 'pg/text@1' },
        }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'DetailFunRun',
        column: col('verificationNote', 'text', { codecRef: { codecId: 'pg/text@1' } }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'DetailFunRun',
        column: col('verifiedAt', 'timestamptz', {
          codecRef: { codecId: 'pg/timestamptz-temporal@1' },
        }),
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
