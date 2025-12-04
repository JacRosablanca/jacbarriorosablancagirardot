import { NextResponse } from "next/server";
import GOOGLE_SHEETS_API_KEY from "@/config/googleApiKey";
import { SPREADSHEET_ID_USUARIOS, RANGE_USUARIOS  } from "@/config/idSheets";

export async function POST(req: Request) {
  try {
    const { usuario, contrasena } = await req.json();

    if (!usuario || !contrasena) {
      return NextResponse.json(
        { message: "Usuario y contraseña requeridos" },
        { status: 400 }
      );
    }

    // Consumimos Google Sheets API directamente con fetch
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID_USUARIOS}/values/${RANGE_USUARIOS}?key=${GOOGLE_SHEETS_API_KEY}`;

    const res = await fetch(url);
    if (!res.ok) {
      return NextResponse.json(
        { message: "Error al consultar Google Sheets" },
        { status: 500 }
      );
    }

    const data = await res.json();
    const rows = (data.values || []).slice(1); // quitamos cabecera

    // buscar usuario (columna B → index 1) y contraseña (columna C → index 2)
    const user = rows.find(
      (row: string[]) => row[1] === usuario && row[2] === contrasena
    );

    if (user) {
      const nombre = user[0]; // Columna A
      const redirectUrl = user[3] || "/panel"; // Columna D

      return NextResponse.json({
        redirectUrl,
        usuario, // lo guardamos también
        nombre,  // este será el visible
      });
    }

    return NextResponse.json(
      { message: "Credenciales inválidas" },
      { status: 401 }
    );
  } catch (error) {
    console.error("Error en login:", error);
    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}h