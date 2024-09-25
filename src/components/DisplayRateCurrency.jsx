import axios from "axios";
import React, { useEffect, useState } from "react";

const DisplayRateCurrency = () => {
  const [loading, setLoading] = useState(true);
  const [currencyRates, setCurrencyRates] = useState({});
  const [error, setError] = useState(null);

  const currencyList = ["CAD", "IDR", "JPY", "CHF", "EUR", "USD"];
  const apiKey = import.meta.env.VITE_CURRENCY_API_KEY;
  const baseUrl = import.meta.env.VITE_CURRENCY_BASE_URL;

  const validateEnvVars = () => {
    if (!apiKey || !baseUrl) {
      setError("API key or base URL is missing. Please check your .env file.");
      return false;
    }
    return true;
  };

  const fetchCurrencyRates = async () => {
    if (!validateEnvVars()) {
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`${baseUrl}&apikey=${apiKey}`);
      if (response.data && response.data.rates) {
        setCurrencyRates(response.data.rates);
      } else {
        throw new Error("Invalid response from API.");
      }
    } catch (err) {
      console.error("Error fetching data:", err.message);
      setError("Failed to fetch currency rates.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrencyRates();
  }, []);

  const calculateRateBuy = (rate) => (parseFloat(rate) * 1.02).toFixed(4);
  const calculateRateSell = (rate) => (parseFloat(rate) * 0.98).toFixed(4);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-orange-500">
        <p className="text-white">
          Loading... <br />
          Please Wait ...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-orange-500">
        <p className="text-white">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center h-screen bg-orange-300">
      <div className="bg-orange-500 text-white p-8 rounded-lg shadow-lg">
        <table className="min-w-full table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2 border">CURRENCY</th>
              <th className="px-4 py-2 border">WE BUY</th>
              <th className="px-4 py-2 border">EXCHANGE RATE</th>
              <th className="px-4 py-2 border">WE SELL</th>
            </tr>
          </thead>
          <tbody>
            {currencyList.map((currency, index) => (
              <tr key={index}>
                <td className="px-4 py-2 border">{currency}</td>
                <td className="px-4 py-2 border">
                  {currencyRates[currency]
                    ? calculateRateBuy(currencyRates[currency])
                    : "N/A"}
                </td>
                <td className="px-4 py-2 border">
                  {currencyRates[currency] || "N/A"}
                </td>
                <td className="px-4 py-2 border">
                  {currencyRates[currency]
                    ? calculateRateSell(currencyRates[currency])
                    : "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-4 text-xs">
          <p>* base currency is IDR</p>
          <p>
            * As for the API,{" "}
            <a href="https://exchangeratesapi.io" className="underline">
              https://exchangeratesapi.io
            </a>{" "}
            is used.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DisplayRateCurrency;
