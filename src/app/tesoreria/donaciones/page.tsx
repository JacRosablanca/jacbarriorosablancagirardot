'use client';

import React, { useState } from 'react';

type PaymentMethod = 'efectivo' | 'nequi' | 'daviplata' | null;

const DonationPage = () => {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(null);
  const [phoneNumber, setPhoneNumber] = useState('');

  const handlePaymentMethodChange = (method: PaymentMethod) => {
    setPaymentMethod(method);
    setPhoneNumber(''); // Reset phone number when changing method
  };

  const handleDonate = () => {
    if (!paymentMethod) {
      alert('Por favor, selecciona un método de pago.');
      return;
    }

    if ((paymentMethod === 'nequi' || paymentMethod === 'daviplata') && !phoneNumber) {
      alert('Por favor, ingresa tu número de celular.');
      return;
    }

    // Redirección a la app correspondiente usando deep links
    if (paymentMethod === 'nequi') {
      // Esto intentará abrir la aplicación Nequi en el dispositivo del usuario.
      window.location.href = 'nequi://';
    } else if (paymentMethod === 'daviplata') {
      // Esto intentará abrir la aplicación Daviplata.
      window.location.href = 'daviplata://';
    }

    console.log(`Iniciando donación de ${paymentMethod} para el número: ${phoneNumber || 'N/A'}`);
    // Aquí iría la lógica para registrar la intención de donación en tu backend.
  };

  const renderPaymentDetails = () => {
    switch (paymentMethod) {
      case 'efectivo':
        return (
          <div className="mt-4 p-4 border rounded-lg bg-gray-50">
            <h3 className="font-semibold text-lg">Instrucciones para Donación en Efectivo</h3>
            <p className="mt-2">
              Para completar tu donación, por favor acércate a nuestras oficinas en [Tu Dirección Aquí].
              ¡Muchas gracias por tu apoyo!
            </p>
          </div>
        );
      case 'nequi':
      case 'daviplata':
        return (
          <div className="mt-4 p-4 border rounded-lg bg-gray-50">
            <h3 className="font-semibold text-lg">
              Completa tu donación por {paymentMethod === 'nequi' ? 'Nequi' : 'Daviplata'}
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              Ingresa tu número de celular. Al continuar, te redirigiremos a la aplicación para que puedas completar el pago de forma segura.
            </p>
            <div className="mt-4">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Número de celular
              </label>
              <input
                type="tel"
                id="phone"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="3001234567"
              />
            </div>
            <button
              onClick={handleDonate}
              className="mt-6 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Continuar a {paymentMethod === 'nequi' ? 'Nequi' : 'Daviplata'}
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800">Haz tu Donación</h2>
        <p className="mt-2 text-center text-gray-600">Selecciona tu método de pago preferido:</p>
        <div className="mt-6 grid grid-cols-3 gap-4">
          <button
            onClick={() => handlePaymentMethodChange('efectivo')}
            className={`p-4 border rounded-lg text-center font-semibold ${paymentMethod === 'efectivo' ? 'bg-indigo-500 text-white ring-2 ring-indigo-500' : 'bg-gray-200 hover:bg-gray-300'}`}
          >
            Efectivo
          </button>
          <button
            onClick={() => handlePaymentMethodChange('nequi')}
            className={`p-4 border rounded-lg text-center font-semibold ${paymentMethod === 'nequi' ? 'bg-indigo-500 text-white ring-2 ring-indigo-500' : 'bg-gray-200 hover:bg-gray-300'}`}
          >
            Nequi
          </button>
          <button
            onClick={() => handlePaymentMethodChange('daviplata')}
            className={`p-4 border rounded-lg text-center font-semibold ${paymentMethod === 'daviplata' ? 'bg-indigo-500 text-white ring-2 ring-indigo-500' : 'bg-gray-200 hover:bg-gray-300'}`}
          >
            Daviplata
          </button>
        </div>
        {renderPaymentDetails()}
      </div>
    </div>
  );
};

export default DonationPage;