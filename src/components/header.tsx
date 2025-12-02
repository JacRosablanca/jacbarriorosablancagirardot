"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import GOOGLE_SHEETS_API_KEY from "@/config/googleApiKey";
import { SPREADSHEET_ID, SHEET_NAME_HEADER } from "@/config/idSheets";
import { MapPin, Clock } from "lucide-react";
import Link from "next/link";

const HEADER_RANGE = `${SHEET_NAME_HEADER}!A2:M2`;

type HeaderData = {
  TipoOac: string;
  TipoUrbanismo: string;
  NombreOac: string;
  Lema: string;
  NumeroNit: string;
  NumeroPersoneria: string;
  FechaPersoneria: string;
  ExpedidoPor: string;
  NumeroRuc: string;
  Ciudad: string;
  Departamento: string;
  LogoDer: string;
  LogoIzq: string;
};

function parseHeaderRow(row: string[]): HeaderData {
  return {
    TipoOac: row[0] || "",
    TipoUrbanismo: row[1] || "",
    NombreOac: row[2] || "",
    Lema: row[3] || "",
    NumeroNit: row[4] || "",
    NumeroPersoneria: row[5] || "",
    FechaPersoneria: row[6] || "",
    ExpedidoPor: row[7] || "",
    NumeroRuc: row[8] || "",
    Ciudad: row[9] || "",
    Departamento: row[10] || "",
    LogoDer: row[11] || "",
    LogoIzq: row[12] || "",
  };
}

export default function Header() {
  const [hora, setHora] = useState("");
  const [ciudad, setCiudad] = useState("...");
  const [header, setHeader] = useState<HeaderData | null>(null);

  useEffect(() => {
    async function fetchHeader() {
      try {
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${HEADER_RANGE}?alt=json&key=${GOOGLE_SHEETS_API_KEY}`;
        const response = await fetch(url);
        const data = await response.json();
        if (data.values && data.values.length > 0) {
          setHeader(parseHeaderRow(data.values[0]));
        }
      } catch (error) {
        console.error("Error fetching header data:", error);
      }
    }
    fetchHeader();
  }, []);

  useEffect(() => {
    const updateHora = () => {
      const now = new Date();
      setHora(
        now.toLocaleTimeString("es-CO", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    };
    updateHora();
    const interval = setInterval(updateHora, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`
            );
            const data = await res.json();
            setCiudad(data.address?.city || data.address?.town || data.address?.village || "Ubicación");
          } catch {
            setCiudad("Ubicación desconocida");
          }
        },
        () => setCiudad("Permiso denegado")
      );
    }
  }, []);

  const nombreOac = header
    ? [header.TipoOac, header.TipoUrbanismo, header.NombreOac].filter(Boolean).join(" ")
    : "Junta de Acción Comunal";

  return (
    <header className="w-full bg-white dark:bg-slate-800/50 shadow-sm border-b border-slate-200 dark:border-slate-700/50">
      {/* Barra superior */}
      <div className="bg-slate-800 dark:bg-slate-900 text-white text-xs flex justify-between px-4 py-1">
        <span className="flex items-center gap-1 text-slate-300"><MapPin size={14} /> {ciudad}</span>
        <span className="flex items-center gap-1"><Clock size={14} /> {hora}</span>
      </div>

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between py-3 px-4 gap-3">
        {/* Contenido principal */}
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between py-3 px-4 gap-3">
          {/* Logo Izquierdo con link a "/" */}
          <Link href="/" aria-label="Inicio">
            <Image
              src={header?.LogoIzq || "/LogoJac.png"}
              alt="Logo Izquierdo"
              width={90}
              height={90}
              className="object-contain cursor-pointer transition-transform duration-300 hover:scale-105"
            />
          </Link>

          {/* Texto Central */}
          <div className="flex flex-col items-center text-center">
            <h1 className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white">{nombreOac}</h1>
            <p className="italic text-sm md:text-base text-gray-700 dark:text-gray-300">{header?.Lema || "Trabajando por la comunidad"}</p>
            <div className="text-xs text-gray-600 dark:text-gray-400 leading-tight">
              <div>{header?.NumeroNit && `NIT: ${header.NumeroNit}`}</div>
              <div>{header?.NumeroPersoneria && `Personería Jurídica ${header.NumeroPersoneria}`}</div>
              <div>{header?.NumeroRuc && `RUC: ${header.NumeroRuc}`}</div>
              <div>{header?.Ciudad}, {header?.Departamento}</div>
            </div>
          </div>

          {/* Logo Derecho con link a Confederación en pestaña nueva */}
          <a
            href="https://confederacionnacionaldeaccioncomunal.org/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Confederación Nacional de Acción Comunal"
          >
            <Image
              src={header?.LogoDer || "/LogoComunal.png"}
              alt="Logo Derecho"
              width={70}
              height={70}
              className="object-contain cursor-pointer transition-transform duration-300 hover:scale-110"
            />
          </a>
        </div>
      </div>
    </header>
  );
}
