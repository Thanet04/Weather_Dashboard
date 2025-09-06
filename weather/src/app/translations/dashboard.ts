export const dashboardTranslations = {
  title: { th: "แดชบอร์ดสภาพอากาศ", en: "Global Weather Dashboard" },
  placeholder: { th: "กรอกชื่อจังหวัด เช่น London", en: "Enter a Province, e.g. London" },
  search: { th: "ค้นหา", en: "Search" },
  clear: { th: "ล้างข้อมูล", en: "Clear" },
  loading: { th: "กำลังโหลดข้อมูล...", en: "Loading data..." },
  error: { th: "เกิดข้อผิดพลาด:", en: "Error:" },
  notFound: { th: "ไม่พบเมืองที่ค้นหา", en: "City not found" },
  mapTitle: { th: "ตำแหน่งบนแผนที่", en: "Map Location" },
  chartTitle: { th: "กราฟแสดงข้อมูล", en: "Data Chart" },
  temp: { th: "อุณหภูมิ", en: "Temperature" },
  humidity: { th: "ความชื้น", en: "Humidity" },
  wind: { th: "ความเร็วลม", en: "Wind Speed" },
  weather: { th: "สภาพอากาศ", en: "Weather" },
  measured: { th: "ค่าที่วัดได้", en: "Measured" },
  tempLabel: { th: "อุณหภูมิ (°C)", en: "Temperature (°C)" },
  humidityLabel: { th: "ความชื้น (%)", en: "Humidity (%)" },
  windLabel: { th: "ความเร็วลม (m/s)", en: "Wind speed (m/s)" },
} as const;

export type DashboardTranslationKey = keyof typeof dashboardTranslations;


