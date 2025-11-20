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
