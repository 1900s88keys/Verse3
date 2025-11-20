import {
  BufferGeometry,
  Color,
  Group,
  Line,
  LineBasicMaterial,
  Vector3,
} from 'three';

import type { Geography } from '../../geo/Geography';
import type { Setting } from '../setting/Setting';

export class Country {
  countriesGroup: Group;

  private setting: Setting;

  private geography: Geography;

  constructor({
    setting,
    geography,
  }: {
    setting: Setting;
    geography: Geography;
  }) {
    this.setting = setting;
    this.geography = geography;
    this.countriesGroup = new Group();
    this.countriesGroup.name = 'Countries';
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
          return this.latLngToVector3(
            lat,
            lng,
            this.setting.earthAttr.radius + 0.1,
          );
        });

        const geometry = new BufferGeometry().setFromPoints(points);

        const line = new Line(geometry, material);
        line.renderOrder = 1;
        this.countriesGroup.add(line);
      });
    });
  }

  // 工具方法
  latLngToVector3(lat: number, lng: number, radius: number) {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);

    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const z = radius * Math.sin(phi) * Math.sin(theta);
    const y = radius * Math.cos(phi);

    return new Vector3(x, y, z);
  }
}
