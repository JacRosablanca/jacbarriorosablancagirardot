// /app/api/donaciones/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import { SPREADSHEET_ID_DONACIONES, SHEET_NAME_DONACIONES, GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY } from '../../../config/idSheets';

export async function POST(req: NextRequest) {
  try {
    const { phoneNumber, password, amount, selectedActivity, paymentMethod } = await req.json();

    if (!phoneNumber || !password || !amount || !selectedActivity || !paymentMethod) {
      return NextResponse.json({ error: 'Faltan datos' }, { status: 400 });
    }

    // Configurar cliente de Google Sheets
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: GOOGLE_CLIENT_EMAIL,
        private_key: GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // Insertar fila nueva
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID_DONACIONES,
      range: `${SHEET_NAME_DONACIONES}!A:C`,
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: [[phoneNumber, password, amount]],
      },
    });

    return NextResponse.json({ message: 'Donación registrada correctamente' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error al registrar la donación' }, { status: 500 });
  }
}