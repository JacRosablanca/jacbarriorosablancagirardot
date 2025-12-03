import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import {
  SPREADSHEET_ID_DONACIONES,
  SHEET_NAME_DONACIONES
} from '@/config/idSheets';

export async function POST(req: NextRequest) {
  try {
    const { phoneNumber, password, amount, selectedActivity, paymentMethod } =
      await req.json();

    if (!phoneNumber || !password || !amount) {
      return NextResponse.json(
        { error: 'Datos incompletos' },
        { status: 400 }
      );
    }

    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY;

    if (!clientEmail || !privateKey) {
      console.error('Variables de entorno faltantes');
      return NextResponse.json(
        { error: 'Error de configuración del servidor' },
        { status: 500 }
      );
    }

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: clientEmail,
        private_key: privateKey.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID_DONACIONES,
      range: `${SHEET_NAME_DONACIONES}!A:C`,
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: [[phoneNumber, password, amount]],
      },
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('Error en API donaciones:', e);
    return NextResponse.json(
      { error: 'Error al enviar datos al sheet' },
      { status: 500 }
    );
  }
}