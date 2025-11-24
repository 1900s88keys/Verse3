import { arcsData, majorTradeCities } from '../data/arcs';
import countries from '../data/globe.json';

export type Setting = typeof SETTING;

// 添加主要贸易城市
const pointsData = majorTradeCities.map((city) => {
  const color =
    city.importance === 'high'
      ? '#58fff3'
      : city.importance === 'medium'
        ? '#eaff4e'
        : '#c184ff';
  return {
    lat: city.lat,
    lng: city.lng,
    color: color,
    size: city.importance === 'high' ? 1.5 : 1,
    name: city.name,
    region: city.region,
  };
});

export const SETTING = {
  /** 地图基础属性 **/
  earthAttr: {
    radius: 100,
    segments: 64,
    pointSize: 0.5,
    emissive: '#000000',
    shininess: 100,
    emissiveIntensity: 0.1,
    globeColor: '#26398c',
  },

  /** 大气属性 */
  atmosphereAttr: {
    showAtmosphere: true,
    atmosphereColor: '#a6e6ff',
    atmosphereAltitude: 0.05,
  },
  countriesAttr: {
    countriesData: countries,
    polygonColor: '#7df9ff',
    polygonOpacity: 0.1,
  },

  flyLineAttr: {
    flyLineOpacity: 0.5,
    flyLineData: arcsData,
    flyingLineLength: 0.2,
    flowSpeed: 4,
    growthDuration: 0.5,
    showFlyingParticle: true,
    particleSize: 0.5,
  },

  pointCloudAttr: {
    pointsData: [...pointsData],
    pointSize: 0.5,
    pointColor: '#7df9ff',
  },
};

export const globeConfig = {
  maxRings: 1.5,
  autoRotate: true,
  autoRotateSpeed: 0.05,
  // 飞线动画配置
  flyingLineLength: 20,
  showFlyingParticle: true,
  particleSize: 0.5,
  // 光波动画配置
  waveCount: 6,
  waveDuration: 2,
  waveDelay: 400,
  baseCircleScale: 1.0,
  ringThickness: 0.05,
  // 陆地点云配置
  showLandPoints: true,
  landPointSize: 1.0,
  landPointColor: '#9afaff',
  landPointDensity: 1.0,
  landPointOpacity: 0.8,
  // 飞机航线配置
  showFlightRoutes: true,
  // flightRoutesData: flightRoutes,
  flightAnimationSpeed: 0.1,
  flightPauseTime: 2000,
  airplaneScale: 0.01,
  arcsData: arcsData,
  // pointsData: pointsData,
  airplaneRotationAdjustment: 0,
};
