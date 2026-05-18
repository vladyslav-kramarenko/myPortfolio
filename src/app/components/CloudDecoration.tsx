'use client';

import styles from './CloudDecoration.module.css';
import type { WeatherCondition } from '../hooks/useWeather';

interface Props {
  condition: WeatherCondition | null;
}

const DROPS = [
  { left: '16%', delay: '0s',    dur: '1.1s' },
  { left: '29%', delay: '0.3s',  dur: '0.95s' },
  { left: '43%', delay: '0.1s',  dur: '1.2s' },
  { left: '57%', delay: '0.45s', dur: '1.0s' },
  { left: '70%', delay: '0.2s',  dur: '1.15s' },
  { left: '83%', delay: '0.55s', dur: '0.9s' },
];

const FLAKES = [
  { left: '14%', delay: '0s',    dur: '3.2s' },
  { left: '31%', delay: '0.7s',  dur: '2.8s' },
  { left: '50%', delay: '0.3s',  dur: '3.6s' },
  { left: '67%', delay: '1.1s',  dur: '3.0s' },
  { left: '82%', delay: '0.5s',  dur: '3.4s' },
];

export default function CloudDecoration({ condition }: Props) {
  const isSunny = condition === 'sunny';
  const isCloudy = condition === 'cloudy';

  return (
    <div className={styles.container}>

      {/* Sun scene — sunny only; clouds own the cloudy state */}
      {isSunny && (
        <div className={`${styles.sunScene} ${styles.sunSceneSunny}`} aria-hidden="true">
          <div className={styles.sunRays} />
          <div className={styles.sun} />
        </div>
      )}

      {/* Echo cloud — full opacity for cloudy; ghostly drift for sunny (clouds clearing) */}
      {isCloudy && <div className={styles.cloudEcho} aria-hidden="true" />}
      {isSunny  && <div className={styles.cloudEchoSunny} aria-hidden="true" />}

      {/* Main cloud — absent on sunny (cleared away) */}
      {!isSunny && (
        <div className={styles.cloud} aria-hidden="true">
          <div className={styles.cloudBase} />
          <div className={styles.cloudBump} />
          <div className={styles.cloudShouL} />
          <div className={styles.cloudPeak} />
          <div className={styles.cloudShouR} />
        </div>
      )}

      {/* Weather zone — sits below the cloud */}
      {condition === 'rainy' && (
        <div className={styles.weatherZone}>
          {DROPS.map((d, i) => (
            <div
              key={i}
              className={styles.raindrop}
              style={{ left: d.left, animationDelay: d.delay, animationDuration: d.dur }}
            />
          ))}
        </div>
      )}

      {condition === 'snowy' && (
        <div className={styles.weatherZone}>
          {FLAKES.map((f, i) => (
            <div
              key={i}
              className={styles.snowflake}
              style={{ left: f.left, animationDelay: f.delay, animationDuration: f.dur }}
            />
          ))}
        </div>
      )}

      {condition === 'foggy' && (
        <div className={styles.weatherZone}>
          <div className={styles.fogStreak} />
          <div className={`${styles.fogStreak} ${styles.fogStreak2}`} />
        </div>
      )}

    </div>
  );
}
