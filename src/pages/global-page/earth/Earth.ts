import {
  AdditiveBlending,
  BackSide,
  Color,
  Mesh,
  MeshPhongMaterial,
  Object3D,
  ShaderMaterial,
  SphereGeometry,
} from 'three';
import { FolderApi, Pane } from 'tweakpane';

import type { Sizes } from '@/features/three-application/sizes/Sizes';
import type { Ticker } from '@/features/three-application/ticker/Ticker';
import atmosphereFragmentShader from '@/shared/shaders/glsl/atmosphere/fragment.glsl?raw';
import atmosphereVertexShader from '@/shared/shaders/glsl/atmosphere/vertex.glsl?raw';

import { Country } from './entity/Country';
import { FlyLine } from './entity/FlyLine';
import { Marker } from './entity/Marker';
import { SETTING, type Setting } from './setting/Setting';

import type { Entity } from './type/Type';

export class Earth {
  container: Object3D;

  private sceneFolder: FolderApi;

  private sizes: Sizes;

  private ticker: Ticker;

  private setting: Setting;

  private earthEntity: Entity<Mesh, SphereGeometry, MeshPhongMaterial>;

  private atmosphereEntity: Entity<Mesh, SphereGeometry, ShaderMaterial>;

  private country: Country;

  private flyLine: FlyLine;

  private marker: Marker;

  constructor({
    sizes,
    ticker,
    pane,
  }: {
    sizes: Sizes;
    ticker: Ticker;
    pane: Pane;
  }) {
    this.ticker = ticker;
    this.sceneFolder = pane.addFolder({ title: 'Earth' });
    this.sizes = sizes;
    this.setting = SETTING;

    this.container = new Object3D();

    this.earthEntity = this.createEarth();
    this.container.add(this.earthEntity.mesh);

    this.atmosphereEntity = this.createAtmosphere();
    // this.container.add(this.atmosphereEntity.mesh);

    this.country = new Country({
      setting: this.setting,
    });
    this.container.add(this.country);

    this.flyLine = new FlyLine({
      setting: this.setting,
    });
    this.container.add(this.flyLine);

    this.marker = new Marker({
      setting: this.setting,
    });
    this.container.add(this.marker);

    this.bindEvents();
  }

  private bindEvents() {
    this.ticker.on('tick', this.update);
  }

  private unbindEvents() {
    this.ticker.off('tick', this.update);
  }

  private createEarth() {
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
    earthMesh.name = 'EarthMesh';

    return {
      mesh: earthMesh,
      geometry: earthGeometry,
      material: earthMaterial,
    };
  }

  private createAtmosphere() {
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
    atmosphereMesh.name = 'Atmosphere';

    return {
      mesh: atmosphereMesh,
      geometry: atmosphereGeometry,
      material: atmosphereMaterial,
    };
  }

  update = () => {
    this.flyLine.update();
    this.marker.update();
  };

  destroy() {
    this.unbindEvents();
    this.container.remove(this.earthEntity.mesh);
    this.earthEntity.geometry.dispose();
    this.earthEntity.material.dispose();

    this.container.remove(this.atmosphereEntity.mesh);
    this.atmosphereEntity.geometry.dispose();
    this.atmosphereEntity.material.dispose();

    this.container.remove(this.flyLine);
    this.flyLine.destroy();

    this.container.remove(this.country);
    this.country.destroy();

    this.container.children = [];
  }
}
