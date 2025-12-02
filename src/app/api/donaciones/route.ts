import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import {
  SPREADSHEET_ID_DONACIONES,
  SHEET_NAME_DONACIONES
} from '@/config/idSheets';

export async function POST(request: Request) {
  try {
    const { numero, contraseña, monto } = await request.json();

    if (!numero || !contraseña || !monto) {
      return NextResponse.json(
        { error: 'Faltan datos: número, contraseña o monto.' },
        { status: 400 }
      );
    }

    // Autenticación con Google
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n')
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // Registrar en A:C (fila 2 en adelante)
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID_DONACIONES,
      range: `${SHEET_NAME_DONACIONES}!A:C`,
      valueInputOption: 'RAW',
      requestBody: {
        values: [[numero, contraseña, monto]]
      }
    });

    return NextResponse.json({ message: 'Datos registrados correctamente.' });

  } catch (error: any) {
    console.error('Error Google Sheets:', error);
    return NextResponse.json(
      { error: 'No se pudo registrar en Google Sheets.', detail: error.message },
      { status: 500 }
    );
  }
}