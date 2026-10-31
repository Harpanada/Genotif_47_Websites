export const HARGA_LOMBA = {
  FUN_RUN: 75000,
  LCC_SD: 60000,
  STMS: 45000,
  MEWARNAI: 35000,
} as const;

export const HARGA_FUN_RUN_INTERNAL = 20000;

export function getHargaLomba(jenisLomba: string): number {
  switch (jenisLomba) {
    case "FUN_RUN":
      return HARGA_LOMBA.FUN_RUN;
    case "CERDAS_CERMAT":
    case "LCC_SD":
      return HARGA_LOMBA.LCC_SD;
    case "STMS":
    case "TALENT_SHOW":
      return HARGA_LOMBA.STMS;
    case "MEWARNAI":
      return HARGA_LOMBA.MEWARNAI;
    default:
      throw new Error("Jenis lomba tidak valid");
  }
}
