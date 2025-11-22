import type { BufferGeometry, Material, Object3D } from 'three';

export interface Entity<
  Instance extends Object3D,
  Geo extends BufferGeometry,
  Mat extends Material,
> {
  mesh: Instance;
  geometry: Geo;
  material: Mat;
}
