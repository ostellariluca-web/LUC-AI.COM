
const API_BASE_URL = 'https://luc-ai-api.vercel.app/api';

export const startDemoCall = async (phone: string): Promise<void> => {
  if (!/^\+\d{6,15}$/.test(phone)) {
    throw new Error("Bitte gültige internationale Nummer (E.164) angeben.");
  }

  const response = await fetch(`${API_BASE_URL}/start-demo`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Ein unbekannter Fehler ist aufgetreten.');
  }
};
