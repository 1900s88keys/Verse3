/**
 * 地图点
 * */
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  CatmullRomCurve3,
  DoubleSide,
  Material,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PlaneGeometry,
  Sprite,
  SpriteMaterial,
  Texture,
  TextureLoader,
  TubeGeometry,
  Vector3,
} from "three";
import { Earth } from "../Earth";

interface ISchemaData {
  name: string;
  longitude: number;
  latitude: number;
}

interface Entity {
  mesh: Mesh;
  material: Material;
  geometry: BufferGeometry;
  texture?: Texture;
}

interface SpriteEntity {
  sprite: Sprite;
  material: Material;
  texture: Texture;
}

const ANGLE = 0.15;

export class Marker {
  private schemaData: ISchemaData;

  private textureLoader: TextureLoader = new TextureLoader();

  private localPosition: Vector3;

  private pillar: Entity;

  private ripple: Entity;

  private connectorLine: Entity;

  private label: SpriteEntity;

  constructor(private earth: Earth, schemaData: ISchemaData) {
    this.schemaData = schemaData;

    this.localPosition = this.earth.lngLatToLocationPosition(
      schemaData.longitude,
      schemaData.latitude
    );

    this.pillar = this.createPillar();
    this.ripple = this.createRipple();
    this.label = this.createLabel();
    this.connectorLine = this.createConnectorLine();

    this.pillar.mesh.add(this.ripple.mesh);
    this.earth.add(
      this.pillar.mesh,
      this.connectorLine.mesh,
      this.label.sprite
    );

    this.earth.editor.tickManager.on("tick", this.tick);
  }

  private createPillar(): Entity {
    const texture = this.textureLoader.load(
      new URL("../assets/光柱.webp", import.meta.url).href
    );
    const geometry = new PlaneGeometry(0.05, 0.3);
    const uv = new Float32Array([0.2, 1, 0.7, 1, 0.2, 0, 0.7, 0]);
    geometry.setAttribute("uv", new BufferAttribute(uv, 2));
    const material = new MeshStandardMaterial({
      color: "#fff",
      map: texture,
      transparent: true,
      side: DoubleSide,
      opacity: 0.5,
      blending: AdditiveBlending,
    });
    const mesh = new Mesh(geometry, material);
    mesh.add(mesh.clone().rotateY(Math.PI / 2));
    mesh.position.copy(this.localPosition.clone());
    mesh.quaternion.setFromUnitVectors(
      new Vector3(0, 1, 0),
      this.localPosition.clone().normalize()
    );
    return {
      mesh,
      geometry,
      material,
      texture,
    };
  }

  private createRipple(): Entity {
    const texture = this.textureLoader.load(
      new URL("../assets/标记.webp", import.meta.url).href
    );
    const geometry = new PlaneGeometry(0.05, 0.05);
    const material = new MeshBasicMaterial({
      color: "#fff",
      map: texture,
      alphaMap: texture,
      transparent: true,
      alphaTest: 0.2,
    });
    const mesh = new Mesh(geometry, material);
    mesh.rotateX(-Math.PI / 2);
    mesh.rotateZ((-Math.PI / 5) * 4);
    mesh.renderOrder = -1;
    return {
      mesh,
      geometry,
      material,
      texture,
    };
  }

  private createConnectorLine(): Entity {
    const geometry = new TubeGeometry(undefined, 20, 0.006, 16, false);
    const material = new MeshBasicMaterial({
      color: 0x6b95db,
      blending: AdditiveBlending,
    });
    const mesh = new Mesh(geometry, material);

    return {
      mesh,
      geometry,
      material,
    };
  }

  private createLabel(): SpriteEntity {
    const texture = this.createLabelTexture();
    const spriteMaterial = new SpriteMaterial({
      map: texture,
      transparent: true,
      depthTest: false,
    });
    const sprite = new Sprite(spriteMaterial);
    sprite.position.copy(this.localPosition.clone());
    return {
      sprite,
      texture,
      material: spriteMaterial,
    };
  }

  private createLabelTexture(
    scaleX: number = 1,
    scaleY: number = 1
  ): CanvasTexture {
    const { name } = this.schemaData;
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = (canvas.width * scaleY) / scaleX;

    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

    ctx.fillStyle = "#fff";
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.font = "bold 40px Microsoft YaHei";
    ctx.fillText(name, canvas.width / 2, canvas.height / 2);

    return new CanvasTexture(canvas);
  }

  private dotCameraAndMarker() {
    const cameraPos = this.earth.editor.cameraControl.camera.position
      .clone()
      .normalize();
    const markerPos = this.localPosition.clone().normalize();
    return cameraPos.dot(markerPos);
  }

  private updateConnectorLine = () => {
    const planeNormal = new Vector3();
    this.earth.editor.cameraControl.camera
      .getWorldDirection(planeNormal)
      .negate();

    const pointToPlane = new Vector3().subVectors(
      this.localPosition,
      new Vector3()
    );

    const distance = pointToPlane.dot(planeNormal);

    const projectPosition = new Vector3()
      .copy(this.localPosition.clone())
      .sub(planeNormal.clone().multiplyScalar(distance))
      .setLength(1 + 0.275);

    this.label.sprite.position.copy(
      projectPosition.clone().add(new Vector3(0, 0, 0))
    );

    const dotRange = Math.min(
      Math.max(this.dotCameraAndMarker(), -ANGLE),
      ANGLE
    );

    const increaseLen = 0.275;
    const lineLen =
      ((this.earth.radius + increaseLen) * (-dotRange + ANGLE)) / (ANGLE * 2);
    const tubeCurve = new CatmullRomCurve3([
      new Vector3(),
      projectPosition.clone().setLength(lineLen),
    ]);

    const geometry = new TubeGeometry(tubeCurve, 20, 0.006, 16, false);
    this.connectorLine.geometry.dispose();
    this.connectorLine.geometry = geometry;
    this.connectorLine.mesh.geometry = geometry;
  };

  tick = () => {
    const dot = this.dotCameraAndMarker();
    if (dot < ANGLE) {
    } else {
    }
    this.updateConnectorLine();
    if (dot < -ANGLE) {
      this.connectorLine.mesh.visible = true;
    } else {
      this.label.sprite.position.copy(this.localPosition.clone());
      this.connectorLine.mesh.visible = false;
    }
  };

  destroy() {
    this.earth.remove(
      this.pillar.mesh,
      this.connectorLine.mesh,
      this.label.sprite
    );

    this.pillar.geometry.dispose();
    this.pillar.material.dispose();
    this.pillar.texture?.dispose();

    this.ripple.geometry.dispose();
    this.ripple.material.dispose();
    this.ripple.texture?.dispose();

    this.label.texture.dispose();
    this.label.material.dispose();
  }
}
