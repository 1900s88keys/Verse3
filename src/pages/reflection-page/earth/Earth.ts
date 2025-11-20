import {
  AdditiveBlending,
  BackSide,
  BufferGeometry,
  Color,
  Material,
  Mesh,
  MeshPhongMaterial,
  Object3D,
  ShaderMaterial,
  SphereGeometry,
} from 'three';

import type { Sizes } from '@/features/three-application/sizes/Sizes';
import atmosphereFragmentShader from '@/shared/shaders/glsl/atmosphere/fragment.glsl?raw';
import atmosphereVertexShader from '@/shared/shaders/glsl/atmosphere/vertex.glsl?raw';

import { Geography } from '../geo/Geography';

import { Country } from './entity/Country';
import { SETTING, type Setting } from './setting/Setting';

import type { FolderApi, Pane } from 'tweakpane';

interface Entity<Geo extends BufferGeometry, Mat extends Material> {
  mesh: Mesh;
  geometry: Geo;
  material: Mat;
}

export class Earth {
  container: Object3D;

  private sceneFolder: FolderApi;

  private sizes: Sizes;

  private setting: Setting;

  private geography: Geography;

  private earthEntity: Entity<SphereGeometry, MeshPhongMaterial>;

  private atmosphereEntity: Entity<SphereGeometry, ShaderMaterial>;

  private country: Country;

  constructor({ sizes, pane }: { sizes: Sizes; pane: Pane }) {
    this.sceneFolder = pane.addFolder({ title: 'Earth' });
    this.sizes = sizes;
    this.setting = SETTING;
    this.geography = new Geography(this.setting.earthAttr.radius);

    this.container = new Object3D();
    this.earthEntity = this.createEarth();
    this.container.add(this.earthEntity.mesh);

    this.atmosphereEntity = this.createAtmosphere();
    this.container.add(this.atmosphereEntity.mesh);

    this.country = new Country({
      setting: this.setting,
      geography: this.geography,
    });
    this.container.add(this.country.countriesGroup);
  }

  createEarth() {
    const earthGeometry = new SphereGeometry(
      this.setting.earthAttr.radius,
      this.setting.earthAttr.segments,
      this.setting.earthAttr.segments,
    );

    const earthMaterial = new MeshPhongMaterial({
      color: new Color(this.setting.earthAttr.globeColor),
      emissive: new Color(this.setting.earthAttr.emissive),
      emissiveIntensity: this.setting.earthAttr.emissiveIntensity,
      shininess: this.setting.earthAttr.shininess,
    });

    const earthMesh = new Mesh(earthGeometry, earthMaterial);

    return {
      mesh: earthMesh,
      geometry: earthGeometry,
      material: earthMaterial,
    };
  }

  createAtmosphere() {
    const atmosphereGeometry = new SphereGeometry(
      this.setting.earthAttr.radius *
        (1 + this.setting.atmosphereAttr.atmosphereAltitude),
      this.setting.earthAttr.segments,
      this.setting.earthAttr.segments,
    );

    const atmosphereMaterial = new ShaderMaterial({
      blending: AdditiveBlending,
      side: BackSide,
      transparent: true,
      uniforms: {
        glowColor: {
          value: new Color(this.setting.atmosphereAttr.atmosphereColor),
        },
      },
      vertexShader: atmosphereVertexShader,
      fragmentShader: atmosphereFragmentShader,
    });

    const atmosphereMesh = new Mesh(atmosphereGeometry, atmosphereMaterial);
    return {
      mesh: atmosphereMesh,
      geometry: atmosphereGeometry,
      material: atmosphereMaterial,
    };
  }

  destroy() {
    this.earthEntity.geometry.dispose();
    this.earthEntity.material.dispose();
    this.atmosphereEntity.geometry.dispose();
    this.atmosphereEntity.material.dispose();
  }
}
