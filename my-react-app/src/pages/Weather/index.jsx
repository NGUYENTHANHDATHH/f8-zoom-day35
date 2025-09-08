import React from "react";
function WeatherApp() {
    const [weatherData, setWeatherData] = React.useState({
        hanoi: { city: "Hà Nội", temp: 28, weather: "Nắng", humidity: 65 },
        hcm: { city: "TP.HCM", temp: 32, weather: "Có mây", humidity: 78 },
        danang: { city: "Đà Nẵng", temp: 30, weather: "Mưa nhẹ", humidity: 82 }
    });

    const [selectedCity, setSelectedCity] = React.useState("hanoi");

    // Chọn icon phù hợp theo tình trạng thời tiết
    const getWeatherIcon = (status) => {
        if (status.includes("Nắng")) return "☀️";
        if (status.includes("Mây")) return "🌤️";
        if (status.includes("Mưa")) return "🌧️";
        return "🌡️";
    };

    const cityWeather = weatherData[selectedCity];

    const refreshData = () => {
        setWeatherData(prev => {
            const updated = { ...prev };
            const randomize = (value) => value + Math.floor(Math.random() * 11) - 5; // ±5
            updated[selectedCity] = {
                ...updated[selectedCity],
                temp: randomize(updated[selectedCity].temp),
                humidity: Math.max(0, Math.min(100, randomize(updated[selectedCity].humidity))) // giữ trong 0–100
            };
            return updated;
        });
    };

    return (
        <div>
            <h1>Thông tin thời tiết</h1>

            <label>
                Chọn thành phố:
                <select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)}>
                    <option value="hanoi">Hà Nội</option>
                    <option value="hcm">TP.HCM</option>
                    <option value="danang">Đà Nẵng</option>
                </select>
            </label>

            <div className="card">
                <h2>{cityWeather.city} {getWeatherIcon(cityWeather.weather)}</h2>
                <p><b>Nhiệt độ:</b> {cityWeather.temp}°C</p>
                <p><b>Tình trạng:</b> {cityWeather.weather}</p>
                <p><b>Độ ẩm:</b> {cityWeather.humidity}%</p>
                <button className="btn" onClick={refreshData}>Làm mới</button>
            </div>
        </div>
    );
}
export default WeatherApp;