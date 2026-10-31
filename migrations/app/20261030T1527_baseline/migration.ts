#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/26c4a9cdfe767c5518742dcdaba378a49b34fcf77ce24feff576d20381ad2268/contract';
import endContract from '../../snapshots/26c4a9cdfe767c5518742dcdaba378a49b34fcf77ce24feff576d20381ad2268/contract.json' with { type: 'json' };
import {
  Migration,
  MigrationCLI,
  col,
  fn,
  lit,
  primaryKey,
  sql,
} from '@prisma/orm-postgres/migration';

export default class M extends Migration<never, End> {
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createSchema({ schema: 'public' }),
      this.createTable({
        schema: 'public',
        table: 'AnggotaCerdasCermat',
        columns: [
          col('detailCerdasCermatId', 'text', {
            notNull: true,
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('kelas', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('namaLengkap', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'AnggotaSTMS',
        columns: [
          col('detailSTMSId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('namaLengkap', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'DataLomba',
        columns: [
          col('checkedInAt', 'timestamptz', { codecRef: { codecId: 'pg/timestamptz-temporal@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('jenisLomba', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('orderId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('statusBayar', 'text', {
            notNull: true,
            default: lit('PENDING'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('ticketToken', 'text', { codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'DetailCerdasCermat',
        columns: [
          col('alamatSekolah', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('dataLombaId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('emailPendamping', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('namaGuruPendamping', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('namaSekolah', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('whatsappPendamping', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'DetailFunRun',
        columns: [
          col('dataLombaId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('email', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('jenisKelamin', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('kontakDarurat', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('namaLengkap', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('noWhatsapp', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'DetailMewarnai',
        columns: [
          col('asalSekolah', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('dataLombaId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('emailOrangTua', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('kelas', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('namaOrangTua', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('namaPeserta', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('paketLomba', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('usia', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('whatsappOrangTua', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'DetailSTMS',
        columns: [
          col('dataLombaId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('email', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('jenisBakat', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('jumlahAnggota', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('kelas', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('menggunakanMusik', 'bool', {
            notNull: true,
            default: lit(false),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('namaPerwakilan', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('noWhatsapp', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('perlengkapan', 'text', { codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.addUnique({
        schema: 'public',
        table: 'DataLomba',
        constraint: 'DataLomba_orderId_key',
        columns: ['orderId'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'DataLomba',
        constraint: 'DataLomba_ticketToken_key',
        columns: ['ticketToken'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'DetailCerdasCermat',
        constraint: 'DetailCerdasCermat_dataLombaId_key',
        columns: ['dataLombaId'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'DetailFunRun',
        constraint: 'DetailFunRun_dataLombaId_key',
        columns: ['dataLombaId'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'DetailMewarnai',
        constraint: 'DetailMewarnai_dataLombaId_key',
        columns: ['dataLombaId'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'DetailSTMS',
        constraint: 'DetailSTMS_dataLombaId_key',
        columns: ['dataLombaId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'AnggotaCerdasCermat',
        index: 'AnggotaCerdasCermat_detailCerdasCermatId_idx_2eaa5184',
        columns: ['detailCerdasCermatId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'AnggotaSTMS',
        index: 'AnggotaSTMS_detailSTMSId_idx_950314ad',
        columns: ['detailSTMSId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'AnggotaCerdasCermat',
        foreignKey: {
          name: 'AnggotaCerdasCermat_detailCerdasCermatId_fkey',
          columns: ['detailCerdasCermatId'],
          references: { schema: 'public', table: 'DetailCerdasCermat', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'AnggotaSTMS',
        foreignKey: {
          name: 'AnggotaSTMS_detailSTMSId_fkey',
          columns: ['detailSTMSId'],
          references: { schema: 'public', table: 'DetailSTMS', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'DetailCerdasCermat',
        foreignKey: {
          name: 'DetailCerdasCermat_dataLombaId_fkey',
          columns: ['dataLombaId'],
          references: { schema: 'public', table: 'DataLomba', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'DetailFunRun',
        foreignKey: {
          name: 'DetailFunRun_dataLombaId_fkey',
          columns: ['dataLombaId'],
          references: { schema: 'public', table: 'DataLomba', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'DetailMewarnai',
        foreignKey: {
          name: 'DetailMewarnai_dataLombaId_fkey',
          columns: ['dataLombaId'],
          references: { schema: 'public', table: 'DataLomba', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'DetailSTMS',
        foreignKey: {
          name: 'DetailSTMS_dataLombaId_fkey',
          columns: ['dataLombaId'],
          references: { schema: 'public', table: 'DataLomba', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
