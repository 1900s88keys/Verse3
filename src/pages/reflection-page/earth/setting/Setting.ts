import countries from '../data/globe.json';

export type Setting = typeof SETTING;

export const SETTING = {
  /** 地图基础属性 **/
  earthAttr: {
    radius: 100,
    segments: 64,
    pointSize: 1,
    globeColor: '#1d072e',
    emissive: '#000000',
    shininess: 50,
    emissiveIntensity: 0.1,
  },

  /** 大气属性 */
  atmosphereAttr: {
    showAtmosphere: true,
    atmosphereColor: '#ffffff',
    atmosphereAltitude: 0.1,
  },
  countriesAttr: {
    countriesData: countries,
    polygonColor: '#ffffff',
    polygonOpacity: 0.05,
  },
};

export const config = {
  arcTime: 2000,
  maxRings: 3,
  autoRotate: true,
  autoRotateSpeed: 0.01,
  flyingLineLength: 20,
  showFlyingParticle: true,
  particleSize: 0.5,
  waveCount: 3,
  waveDuration: 2.5,
  waveDelay: 800,
  baseCircleScale: 0.3,
  ringThickness: 0.15,
  countriesData: [],
  arcsData: [],
  pointsData: [],
  showLandPoints: true,
  landPointSize: 1.0,
  landPointColor: '#ffffff',
  landPointDensity: 1.0,
  landPointOpacity: 0.8,
  showFlightRoutes: false,
  flightRoutesData: [],
  flightAnimationSpeed: 0.01,
  flightPauseTime: 2000,
  airplaneScale: 0.01,
  airplaneRotationAdjustment: 0,
};
