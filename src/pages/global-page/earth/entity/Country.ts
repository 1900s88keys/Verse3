import {
  BufferGeometry,
  Color,
  Object3D,
  Line,
  LineBasicMaterial,
} from 'three';

import { latLngToVector3 } from '@/shared/utils/geo/Geo';

import type { Setting } from '../setting/Setting';

export class Country extends Object3D {
  private setting: Setting;

  constructor({ setting }: { setting: Setting }) {
    super();
    this.setting = setting;
    this.name = 'Countries';
    this.createCountries();
  }

  createCountries() {
    if (
      !this.setting.countriesAttr.countriesData ||
      !this.setting.countriesAttr.countriesData.features
    )
      return;

    this.setting.countriesAttr.countriesData.features.forEach((feature) => {
      if (
        feature.geometry.type === 'Polygon' ||
        feature.geometry.type === 'MultiPolygon'
      ) {
        this.createCountryPolygon(feature);
      }
    });
  }

  createCountryPolygon(
    feature:
      | {
          type: string;
          properties: { admin: string; name: string; continent: string };
          geometry: { type: string; coordinates: number[][][] };
        }
      | {
          type: string;
          properties: { admin: string; name: string; continent: string };
          geometry: { type: string; coordinates: number[][][][] };
        },
  ) {
    const coordinates =
      feature.geometry.type === 'Polygon'
        ? [feature.geometry.coordinates]
        : feature.geometry.coordinates;

    const material = new LineBasicMaterial({
      color: new Color(this.setting.countriesAttr.polygonColor),
      transparent: true,
      opacity: this.setting.countriesAttr.polygonOpacity,
      vertexColors: false,
      depthTest: true,
      depthWrite: false,
    });

    coordinates.forEach((polygon) => {
      polygon.forEach((ring) => {
        if (ring.length < 3) return;

        const points = ring.map((coord) => {
          const [lng, lat] = coord as [number, number];
          return latLngToVector3(lat, lng, this.setting.earthAttr.radius + 0.1);
        });

        const geometry = new BufferGeometry().setFromPoints(points);

        const line = new Line(geometry, material);
        line.renderOrder = 1;
        this.add(line);
      });
    });
  }

  destroy() {
    this.children.forEach((child) => {
      if (child instanceof Line) {
        child.geometry.dispose();
        child.material.dispose();
      }
    });
    this.children = [];
  }
}
