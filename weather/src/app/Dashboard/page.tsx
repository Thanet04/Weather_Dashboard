"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

// โหลดแผนที่แบบ dynamic เพื่อลดปัญหา SSR
const Map = dynamic(() => import("../components/Map"), { ssr: false });

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

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

  const API_KEY = "e9a535eebda5c1ddc55ab39f9835d774";

  const fetchWeather = async (cityName: string) => {
    setLoading(true);
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`
      );
      const result = await res.json();
      if (res.ok) {
        setData(result);
        setError(null);
      } else {
        setError(result.message);
        setData(null);
      }
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchWeather(city);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchWeather(city);
  };

  const chartData = data
    ? {
        labels: ["อุณหภูมิ (°C)", "ความชื้น (%)"],
        datasets: [
          {
            label: "ข้อมูลสภาพอากาศ",
            data: [data.main.temp, data.main.humidity],
            fill: false,
            borderColor: "rgb(75, 192, 192)",
            tension: 0.3,
          },
        ],
      }
    : null;

  return (
    <div className="w-full mx-auto px-4 py-10 space-y-6">
      <h1 className="text-3xl font-bold text-center mb-4">🌎 Global Weather Dashboard</h1>

      <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="กรอกชื่อเมือง เช่น London"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          ค้นหา
        </button>
      </form>

      {loading && <p className="text-center text-gray-600">⏳ กำลังโหลดข้อมูล...</p>}
      {error && <p className="text-center text-red-500">❌ {error}</p>}

      {data && (
      <>
        <div className="flex flex-col md:flex-row gap-4">
          {/* ข้อมูล */}
          <div className="bg-white rounded-xl shadow-lg p-6 space-y-2 flex-1">
            <h2 className="text-xl font-semibold text-center">{data.name}</h2>
            <p>🌡 <span className="font-medium">อุณหภูมิ:</span> {data.main.temp} °C</p>
            <p>💧 <span className="font-medium">ความชื้น:</span> {data.main.humidity} %</p>
            <p>🌬 <span className="font-medium">ความเร็วลม:</span> {data.wind.speed} m/s</p>
            <p>⛅ <span className="font-medium">สภาพอากาศ:</span> {data.weather[0].description}</p>
          </div>

          {/* แผนที่ */}
          <div className="bg-white p-6 rounded-xl shadow-md flex-1 min-h-[300px]">
            <h3 className="text-lg font-bold mb-2">🗺 ตำแหน่งบนแผนที่</h3>
            <Map
              lat={data.coord.lat}
              lon={data.coord.lon}
              name={data.name}
              description={data.weather[0].description}
            />
          </div>
        </div>

        {/* กราฟ */}
        {chartData && (
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-lg font-bold mb-2">📈 กราฟแสดงข้อมูล</h3>
            <Line data={chartData} />
          </div>
        )}
      </>
    )}
    </div>
  );
}
