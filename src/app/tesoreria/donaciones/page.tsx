'use client';

import React, { useState } from 'react';

type PaymentMethod = 'efectivo' | 'nequi' | 'daviplata' | null;

const DonationPage = () => {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(null);
  const [selectedActivity, setSelectedActivity] = useState<string>('');
  const [amount, setAmount] = useState<string>(''); // Estado para el monto
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState(''); // Estado para la clave

  // Lista de actividades a las que se puede donar
  const activities = [
    'Proyecto de pavimentación',
    'Fondo para eventos comunitarios',
    'Mantenimiento de zonas verdes',
    'Donación general',
  ];

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, ''); // Elimina todo lo que no sea un dígito
    setAmount(rawValue);
  };

  const handlePaymentMethodChange = (method: PaymentMethod) => {
    setPaymentMethod(method);
    setPhoneNumber(''); // Reset phone number when changing method
    setPassword(''); // Reset password when changing method
  };

  const handleDonate = () => {
    if (!amount || parseFloat(amount) <= 0) {
      alert('Por favor, ingresa un monto válido para donar.');
      return;
    }

    if (!paymentMethod) {
      alert('Por favor, selecciona un método de pago.');
      return;
    }

    if ((paymentMethod === 'nequi' || paymentMethod === 'daviplata') && !phoneNumber) {
      alert('Por favor, ingresa tu número de celular.');
      return;
    }

    if ((paymentMethod === 'nequi' || paymentMethod === 'daviplata') && !password) {
      alert('Por favor, ingresa tu clave.');
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

    console.log(`Iniciando donación de $${amount} para "${selectedActivity}" con ${paymentMethod}. Número: ${phoneNumber || 'N/A'}. La clave NO se debe guardar.`);
    // Aquí iría la lógica para registrar la intención de donación en tu backend.
  };

  const renderPaymentDetails = () => {
    switch (paymentMethod) {
      case 'efectivo':
        return (
          <div className="mt-6 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800">
            <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-100">Instrucciones para Donación en Efectivo</h3>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Para completar tu donación, por favor acércate a nuestras oficinas en [Tu Dirección Aquí].
              ¡Muchas gracias por tu apoyo!
            </p>
          </div>
        );
      case 'nequi':
      case 'daviplata':
        return (
          <div className="mt-6 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800">
            <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-100">
              Donar con {paymentMethod === 'nequi' ? 'Nequi' : 'Daviplata'}
            </h3>
            <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 rounded-lg">
              <p className="text-sm text-red-800 dark:text-red-200">
                <span className="font-bold">Advertencia de Seguridad:</span> Nunca compartas tu clave. Un sitio web legítimo nunca te la pedirá.
                Al continuar, serás redirigido a la app oficial para completar el pago de forma segura.
              </p>
            </div>

            <div className="mt-4">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Número de celular
              </label>
              <input
                type="tel"
                id="phone"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="3001234567"
              />
            </div>
            <div className="mt-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Clave de ingreso
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="••••"
              />
            </div>
            <button
              onClick={handleDonate}
              className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4">
      <div className="max-w-lg w-full bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white">Apoya a tu Comunidad</h2>

        {/* Paso 1: Selección de Actividad */}
        <div className="mt-8">
          <label htmlFor="activity" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            1. Elige una causa para tu donación
          </label>
          <select
            id="activity"
            value={selectedActivity}
            onChange={(e) => setSelectedActivity(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="" disabled>-- Selecciona una actividad --</option>
            {activities.map((activity) => (
              <option key={activity} value={activity}>{activity}</option>
            ))}
          </select>
        </div>

        {/* Paso 2: Monto a Donar (se muestra después de seleccionar una actividad) */}
        {selectedActivity && (
          <div className="mt-6">
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              2. Ingresa el valor a donar
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">$</span>
              <input
                type="text"
                id="amount"
                value={amount === '' ? '' : new Intl.NumberFormat('es-CO').format(Number(amount))}
                onChange={handleAmountChange}
                className="pl-7 mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="50000"
              />
            </div>
          </div>
        )}

        {/* Paso 3: Pasarela de Pago (se muestra después de seleccionar actividad y monto) */}
        {selectedActivity && amount && parseFloat(amount) > 0 && (
          <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">3. Selecciona tu método de pago</p>
            <div className="mt-4 grid grid-cols-3 gap-4">
              <button
                onClick={() => handlePaymentMethodChange('efectivo')}
                className={`p-4 border rounded-lg text-center font-semibold transition-colors ${paymentMethod === 'efectivo' ? 'bg-blue-600 text-white ring-2 ring-blue-500' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
              >
                Efectivo
              </button>
              <button
                onClick={() => handlePaymentMethodChange('nequi')}
                className={`p-4 border rounded-lg text-center font-semibold transition-colors ${paymentMethod === 'nequi' ? 'bg-blue-600 text-white ring-2 ring-blue-500' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
              >
                Nequi
              </button>
              <button
                onClick={() => handlePaymentMethodChange('daviplata')}
                className={`p-4 border rounded-lg text-center font-semibold transition-colors ${paymentMethod === 'daviplata' ? 'bg-blue-600 text-white ring-2 ring-blue-500' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
              >
                Daviplata
              </button>
            </div>
            {renderPaymentDetails()}
          </div>
        )}
      </div>
    </div>
  );
};

export default DonationPage;