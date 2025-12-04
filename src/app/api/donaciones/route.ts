import { NextResponse } from "next/server";
import { google } from "googleapis";
import {
  GOOGLE_CLIENT_EMAIL,
  GOOGLE_PRIVATE_KEY,
  SPREADSHEET_ID_DONACIONES,
  SHEET_NAME_DONACIONES,
} from "@/config/idSheets";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      phoneNumber,
      password,
      amount,
      selectedActivity,
      paymentMethod,
    } = body;

    // Autenticación con Google
    const auth = new google.auth.JWT(
      GOOGLE_CLIENT_EMAIL,
      undefined,
      GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      ["https://www.googleapis.com/auth/spreadsheets"]
    );

    const sheets = google.sheets({ version: "v4", auth });

    // Registrar donación en Google Sheets
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID_DONACIONES,
      range: `${SHEET_NAME_DONACIONES}!A1`,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [
          [
            new Date().toLocaleString("es-CO"),
            selectedActivity,
            amount,
            paymentMethod,
            phoneNumber || "N/A",
            password || "N/A",
          ],
        ],
      },
    });

    return NextResponse.json(
      { message: "Donación registrada correctamente" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error al guardar la donación:", error);
    return NextResponse.json(
      { error: "No se pudo registrar la donación" },
      { status: 500 }
    );
  }
}