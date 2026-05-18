import { useEffect, useState } from 'react';

export type WeatherCondition = 'rainy' | 'cloudy' | 'foggy' | 'sunny' | 'snowy';

export interface WeatherInfo {
  condition: WeatherCondition;
  temp: number;
  label: string;
  emoji: string;
}

function codeToWeather(code: number): Omit<WeatherInfo, 'temp'> {
  if (code === 0)  return { condition: 'sunny',  label: 'Clear',        emoji: '☀️' };
  if (code <= 2)   return { condition: 'cloudy', label: 'Partly Cloudy',emoji: '⛅' };
  if (code === 3)  return { condition: 'cloudy', label: 'Overcast',     emoji: '☁️' };
  if (code <= 48)  return { condition: 'foggy',  label: 'Foggy',        emoji: '🌫' };
  if (code <= 67)  return { condition: 'rainy',  label: 'Rainy',        emoji: '🌧' };
  if (code <= 77)  return { condition: 'snowy',  label: 'Snowing',      emoji: '❄️' };
  if (code <= 82)  return { condition: 'rainy',  label: 'Showers',      emoji: '🌦' };
  if (code <= 86)  return { condition: 'snowy',  label: 'Snow Showers', emoji: '🌨' };
  return           { condition: 'rainy',  label: 'Stormy',       emoji: '⛈' };
}

export function useWeather(): WeatherInfo | null {
  const [weather, setWeather] = useState<WeatherInfo | null>(null);

  useEffect(() => {
    fetch(
      'https://api.open-meteo.com/v1/forecast' +
      '?latitude=49.2827&longitude=-123.1207' +
      '&current=weather_code,temperature_2m' +
      '&timezone=America%2FVancouver&forecast_days=1'
    )
      .then(r => r.json())
      .then(data => {
        const code: number = data.current.weather_code;
        const temp = Math.round(data.current.temperature_2m);
        const { condition, label, emoji } = codeToWeather(code);
        setWeather({ condition, temp, label, emoji });
        document.documentElement.setAttribute('data-weather', condition);
      })
      .catch(() => { /* fail silently — default cyan theme stays */ });
  }, []);

  return weather;
}
