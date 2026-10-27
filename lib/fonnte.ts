type FonnteResponse = {
  status: boolean;
  detail?: string;
  reason?: string;
};

export async function sendWhatsAppMessage(
  target: string,
  message: string,
): Promise<FonnteResponse> {
  const token = process.env.FONNTE_TOKEN;

  if (!token) {
    throw new Error("FONNTE_TOKEN belum dikonfigurasi");
  }

  const form = new FormData();
  form.append("target", target);
  form.append("message", message);

  const response = await fetch("https://api.fonnte.com/send", {
    method: "POST",
    headers: {
      Authorization: token,
    },
    body: form,
    cache: "no-store",
  });

  const raw = await response.text();

  console.log("FONNTE HTTP STATUS:", response.status);
  console.log("FONNTE RESPONSE:", raw);

  if (!response.ok) {
    throw new Error(`Fonnte HTTP error: ${response.status}`);
  }

  let result: FonnteResponse;

  try {
    result = JSON.parse(raw) as FonnteResponse;
  } catch {
    throw new Error("Respons Fonnte bukan JSON yang valid");
  }

  if (result.status !== true) {
    throw new Error(
      result.reason ?? result.detail ?? "Fonnte gagal mengirim pesan",
    );
  }

  return result;
}
