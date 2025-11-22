import { arcsData } from '../data/arcs';
import countries from '../data/globe.json';

export type Setting = typeof SETTING;

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
    flyingLineLength: 0.4,
    flowSpeed: 0.4,
    growthDuration: 0.5,
    showFlyingParticle: true,
    particleSize: 0.5,
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
