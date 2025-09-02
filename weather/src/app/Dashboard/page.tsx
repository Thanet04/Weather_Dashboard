"use client";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
} from "chart.js";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import Navbar from "../components/Navbar";
import { dashboardTranslations } from "../translations/dashboard";
// โหลดแผนที่แบบ dynamic เพื่อลดปัญหา SSR
const Map = dynamic(() => import("../components/Map"), { ssr: false });

ChartJS.register(LineElement, CategoryScale, LinearScale, BarElement, PointElement, Tooltip, Legend);

interface WeatherData {
  name: string;
  coord: { lat: number; lon: number };
  main: {
    temp: number;
    humidity: number;
  };
  weather: {
    description: string;
  }[];
  wind: {
    speed: number;
  };
}

export default function Dashboard() {
  const [city, setCity] = useState("Bangkok");
  const [data, setData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState<"th" | "en">("th");
  const t = (key: keyof typeof dashboardTranslations) => dashboardTranslations[key][language];

  const API_KEY = "e9a535eebda5c1ddc55ab39f9835d774";

  const fetchWeather = async (cityName: string) => {
    setLoading(true);
    try {
      const weatherRes = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cityName)}&appid=${API_KEY}&units=metric&lang=${language}`
      );
      const weather = await weatherRes.json();
      if (weatherRes.ok) {
        setData(weather);
        setError(null);
      } else {
        setError(weather.message || t("error"));
        setData(null);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Unexpected error");
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchWeather(city);
  }, []);

  useEffect(() => {
    if (data) {
      fetchWeather(city);
    }
  }, [language]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: "top" as const } },
    scales: {
      y: { ticks: { stepSize: 5 } },
    },
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchWeather(city);
  };

  const chartData = data
  ? {
      labels: [t("tempLabel"), t("humidityLabel"), t("windLabel")],
      datasets: [
        {
          label: t("measured"),
          data: [data.main.temp, data.main.humidity, data.wind.speed],
          backgroundColor: [
            "rgba(255, 99, 132, 0.6)",
            "rgba(54, 162, 235, 0.6)",
            "rgba(75, 192, 192, 0.6)",
          ],
          borderColor: [
            "rgb(255, 99, 132)",
            "rgb(54, 162, 235)",
            "rgb(75, 192, 192)",
          ],
          borderWidth: 1,
        },
      ],
    }
  : null;

  return (
    <>
    <Navbar
        language={language}
        onToggle={() => setLanguage((prev) => (prev === "th" ? "en" : "th"))}
        title={`🌎 ${t("title")}`}
      />

    <div className="w-full mx-auto px-4 py-6 md:py-10 space-y-6">
      
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 mb-4">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder={t("placeholder")}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button type="submit" className="w-full sm:w-auto px-4 py-2  bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          {t("search")}
        </button>
        <button
          type="button"
          onClick={() => {
            setCity("");
            setData(null);
            setError(null);
          }}
          className="w-full sm:w-auto px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          {t("clear")}
        </button>
      </form>

      {loading && <p className="text-center text-gray-600">⏳ {t("loading")}</p>}
      {error && <p className="text-center text-red-500">❌ {t("error")} {error}</p>}

      {data && (
      <>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="bg-white rounded-xl shadow-lg p-6 space-y-4 flex-1">
            <h2 className="text-xl font-semibold text-center">{data.name}</h2>
            <p>🌡 <span className="text-lg font-medium">{t("temp")}:</span> {data.main.temp} °C</p>
            <p>💧 <span className="text-lg font-medium">{t("humidity")}:</span> {data.main.humidity} %</p>
            <p>🌬 <span className="text-lg font-medium">{t("wind")}:</span> {data.wind.speed} m/s</p>
            <p>⛅ <span className="text-lg font-medium">{t("weather")}:</span> {data.weather[0].description}</p>
          </div>

          {/* แผนที่ */}
          <div className="bg-white p-6 rounded-xl shadow-md flex-1 min-h-[300px]">
            <h3 className="text-lg font-bold mb-2">🗺 {t("mapTitle")}</h3>
            <Map
              lat={data.coord.lat}
              lon={data.coord.lon}
              name={data.name}
              description={data.weather[0].description}
            />
          </div>
        </div>

        {chartData && (
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-lg font-bold mb-2">📈 {t("chartTitle")}</h3>
            <div className="h-64 md:h-80">
              <Bar data={chartData} options={chartOptions} />
            </div>
          </div>
        )}
      </>
    )}
    </div>
    </>
  );
}
