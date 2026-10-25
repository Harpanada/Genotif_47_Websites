import "server-only";
import midtransClient from "midtrans-client";

export type SnapParameters = {
  transaction_details: {
    order_id: string;
    gross_amount: number;
  };
  customer_details?: {
    first_name?: string;
    last_name?: string;
    email?: string;
    phone?: string;
  };
};

const serverKey = process.env.MIDTRANS_SERVER_KEY;
const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY;

if (!serverKey) {
  throw new Error("MIDTRANS_SERVER_KEY belum diatur");
}

if (!clientKey) {
  throw new Error("NEXT_PUBLIC_MIDTRANS_CLIENT_KEY belum diatur");
}

export const snap = new midtransClient.Snap({
  isProduction: process.env.MIDTRANS_IS_PRODUCTION === "true",
  serverKey,
  clientKey,
});

export type SnapTransactionResponse = {
  token: string;
  redirect_url: string;
};

export async function createSnapTransaction(
  params: SnapParameters,
): Promise<SnapTransactionResponse> {
  const result: unknown = await snap.createTransaction(params);

  if (
    typeof result !== "object" ||
    result === null ||
    !("token" in result) ||
    typeof result.token !== "string"
  ) {
    throw new Error("Token Snap tidak ditemukan dalam respons Midtrans.");
  }

  const redirectUrl =
    "redirect_url" in result && typeof result.redirect_url === "string"
      ? result.redirect_url
      : "";

  return {
    token: result.token,
    redirect_url: redirectUrl,
  };
}
