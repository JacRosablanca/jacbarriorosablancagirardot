"use client";

import React, { useState } from "react";

type PaymentMethod = "efectivo" | "nequi" | "daviplata" | null;

const DonationPage = () => {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(null);
  const [selectedActivity, setSelectedActivity] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");

  const activities = [
    "Proyecto de pavimentación",
    "Fondo para eventos comunitarios",
    "Mantenimiento de zonas verdes",
    "Donación general",
  ];

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, "");
    setAmount(rawValue);
  };

  const handlePaymentMethodChange = (method: PaymentMethod) => {
    setPaymentMethod(method);
    setPhoneNumber("");
    setPassword("");
  };

  const handleDonate = async () => {
    if (!amount || parseInt(amount) <= 0)
      return alert("Ingresa un monto válido.");

    if (!selectedActivity)
      return alert("Selecciona una actividad.");

    if (!paymentMethod)
      return alert("Selecciona un método de pago.");

    if (
      ["nequi", "daviplata"].includes(paymentMethod) &&
      (!phoneNumber || !password)
    ) {
      return alert("Ingresa número y contraseña.");
    }

    try {
      const response = await fetch("/api/donaciones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phoneNumber,
          password,
          amount,
          selectedActivity,
          paymentMethod,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Donación registrada correctamente");

        // Reset
        setPhoneNumber("");
        setPassword("");
        setAmount("");
        setSelectedActivity("");
        setPaymentMethod(null);
      } else {
        alert("Error: " + data.error);
      }
    } catch (err) {
      alert("Error enviando la donación");
    }
  };

  const renderPaymentDetails = () => {
    switch (paymentMethod) {
      case "efectivo":
        return (
          <div className="mt-6 p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
            <h3 className="font-semibold text-lg">Donación en efectivo</h3>
            <p className="mt-2 text-sm">
              Acércate a la sede de la JAC y registramos tu aporte.
            </p>
          </div>
        );

      case "nequi":
      case "daviplata":
        return (
          <div className="mt-6 p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
            <h3 className="font-semibold text-lg">
              Donar con {paymentMethod === "nequi" ? "Nequi" : "Daviplata"}
            </h3>

            <div className="mt-4 text-sm text-red-600 bg-red-200 p-2 rounded">
              Nunca compartas tu contraseña fuera de apps oficiales.
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium">Número de celular</label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="mt-1 w-full p-2 border rounded"
              />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full p-2 border rounded"
              />
            </div>

            <button
              onClick={handleDonate}
              className="mt-6 w-full bg-blue-600 text-white py-2 rounded"
            >
              Continuar
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-lg w-full bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-center">Apoya a tu comunidad</h2>

        <div className="mt-6">
          <label className="block text-sm mb-2">1. Elige una causa</label>
          <select
            value={selectedActivity}
            onChange={(e) => setSelectedActivity(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">-- Selecciona una actividad --</option>
            {activities.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>

        {selectedActivity && (
          <div className="mt-6">
            <label className="block text-sm mb-2">2. Valor a donar</label>
            <input
              type="text"
              value={
                amount
                  ? new Intl.NumberFormat("es-CO").format(Number(amount))
                  : ""
              }
              onChange={handleAmountChange}
              className="w-full p-2 border rounded"
            />
          </div>
        )}

        {selectedActivity && amount && parseInt(amount) > 0 && (
          <div className="mt-8 border-t pt-6">
            <p className="text-sm mb-2">3. Método de pago</p>

            <div className="grid grid-cols-3 gap-4">
              {["efectivo", "nequi", "daviplata"].map((m) => (
                <button
                  key={m}
                  onClick={() => handlePaymentMethodChange(m as PaymentMethod)}
                  className={`p-3 border rounded text-sm font-semibold ${
                    paymentMethod === m
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 dark:bg-gray-700"
                  }`}
                >
                  {m.charAt(0).toUpperCase() + m.slice(1)}
                </button>
              ))}
            </div>

            {renderPaymentDetails()}
          </div>
        )}
      </div>
    </div>
  );
};

export default DonationPage;