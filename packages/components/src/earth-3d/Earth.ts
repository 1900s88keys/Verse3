import {
  SphereGeometry,
  MeshStandardMaterial,
  Mesh,
  TextureLoader,
  DirectionalLight,
  AmbientLight,
  Color,
  BufferGeometry,
  Points,
  PointsMaterial,
  BufferAttribute,
  Object3D,
  Sprite,
  Material,
  Texture,
  SpriteMaterial,
} from "three";
import { Geography } from "@verse3/common";
import { Editor, IEditorOptions } from "@verse3/core";

interface EarthEntity {
  mesh: Mesh;
  material: MeshStandardMaterial;
  geometry: SphereGeometry;
}

interface StartEntity {
  mesh: Points;
  material: PointsMaterial;
  geometry: BufferGeometry;
}

interface Lights {
  ambientLight: AmbientLight;
  sunLight: DirectionalLight;
  fillLight: DirectionalLight;
}

interface SpriteEntity {
  sprite: Sprite;
  material: Material;
  texture: Texture;
}

export class Earth {
  private earthAttr = {
    radius: 1,
    segmentsWidth: 128, // 增加细分以提高质量
    segmentsHeight: 128,
  };

  private textureLoader: TextureLoader = new TextureLoader();

  private geography: Geography;

  private earthEntity: EarthEntity;

  private startEntity: StartEntity;

  private outRing: SpriteEntity;

  private lights: Lights;
  
  editor: Editor;

  constructor(option: IEditorOptions) {
    this.editor = new Editor(option);

    this.geography = new Geography();
    this.lights = this.setupLighting();
    this.earthEntity = this.createEarth();
    this.startEntity = this.createStars();
    this.outRing = this.createOutRing()
    this.add(
      this.earthEntity.mesh,
      this.startEntity.mesh,
      this.outRing.sprite,
      this.lights.ambientLight,
      this.lights.sunLight,
      this.lights.fillLight
    );
    this.setupCamera();
  }

  get radius() {
    return this.earthAttr.radius;
  }

  get segmentsWidth() {
    return this.earthAttr.segmentsWidth;
  }

  get segmentsHeight() {
    return this.earthAttr.segmentsHeight;
  }

  /**
   * 设置光照
   */
  private setupLighting(): Lights {
    // 环境光 - 提供基础亮度
    const ambientLight = new AmbientLight(0xffffff, 0.3);

    // 主光源 - 模拟太阳光，从左上角照射
    const sunLight = new DirectionalLight(0xffffff, 1.2);
    sunLight.position.set(5, 5, 5);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;

    // 补光 - 从右侧提供柔和的光线
    const fillLight = new DirectionalLight(0xffffff, 0.4);
    fillLight.position.set(-3, 2, 3);
    return {
      ambientLight,
      sunLight,
      fillLight,
    };
  }

  /**
   * 创建地球
   */
  private createEarth = (): EarthEntity => {
    // 创建高精度的球体几何
    const geometry = new SphereGeometry(
      this.earthAttr.radius,
      this.earthAttr.segmentsWidth,
      this.earthAttr.segmentsHeight
    );

    const material = new MeshStandardMaterial({
      color: new Color(0xffffff),
      // 基础颜色贴图
      map: this.textureLoader.load(
        new URL("./assets/COLOR.jpg", import.meta.url).href
      ),

      // 法线贴图
      normalMap: this.textureLoader.load(
        new URL("./assets/Ice-Bump.webp", import.meta.url).href
      ),

      // 粗糙度贴图
      roughnessMap: this.textureLoader.load(
        new URL("./assets/SPECULARITY.png", import.meta.url).href
      ),
      roughness: 1.0, // 配合粗糙度贴图使用

      // 金属度
      metalness: 0.5,

      transparent: true,
    });

    // 创建地球网格
    const earthMesh = new Mesh(geometry, material);
    earthMesh.castShadow = true;
    earthMesh.receiveShadow = true;
    return {
      mesh: earthMesh,
      geometry,
      material,
    };
  };

  /**
   * 创建星空背景
   */
  private createStars(): StartEntity {
    const starCount = 2000;
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      const i3 = i * 3;

      // 随机位置
      const radius = 50 + Math.random() * 50;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);

      // 随机颜色
      const color = new Color();
      color.setHSL(Math.random(), 0.2, 0.8);
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
    }

    const starsGeometry = new BufferGeometry();
    starsGeometry.setAttribute("position", new BufferAttribute(positions, 3));
    starsGeometry.setAttribute("color", new BufferAttribute(colors, 3));

    const starsMaterial = new PointsMaterial({
      size: 0.1,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
    });

    const starsMesh = new Points(starsGeometry, starsMaterial);
    return {
      mesh: starsMesh,
      material: starsMaterial,
      geometry: starsGeometry,
    };
  }

  private createOutRing(): SpriteEntity {
    const texture = this.textureLoader.load(
      new URL("./assets/ring.png", import.meta.url).href
    );
    const spriteMaterial = new SpriteMaterial({
      map: texture,
      alphaMap: texture,
      transparent: true,
      depthTest: false,
      depthWrite: false,
    });
    const sprite = new Sprite(spriteMaterial);
    const scale = 2 * this.earthAttr.radius + 1.8;
    sprite.scale.set(scale, scale, 1);
    sprite.renderOrder = -1;
    return {
      sprite,
      texture,
      material: spriteMaterial,
    };
  }

  /**
   * 设置相机位置
   */
  private setupCamera(): void {
    // 设置相机初始位置，模拟图片中的视角
    this.editor.cameraControl.setPosition(3, 2, 3);
    this.editor.cameraControl.setTarget(0, 0, 0);

    // 启用阻尼效果
    this.editor.cameraControl.controls.enableDamping = true;
    this.editor.cameraControl.controls.dampingFactor = 0.05;

    // 设置缩放限制
    this.editor.cameraControl.controls.minDistance = 1.5;
    this.editor.cameraControl.controls.maxDistance = 10;
  }

  add = (...object: Object3D[]) => {
    this.editor.sceneManager.scene.add(...object);
  };

  remove = (...object: Object3D[]) => {
    this.editor.sceneManager.scene.remove(...object);
  };

  /**
   * 设置地球自转
   */
  setRotation(enabled: boolean, speed: number = 0.001): void {
    if (enabled) {
      this.editor.cameraControl.setAutoRotate(true);
      this.editor.cameraControl.setAutoRotateSpeed(speed);
    } else {
      this.editor.cameraControl.setAutoRotate(false);
    }
  }

  /**
   * @param { number} longitude 经度
   * @param { number} latitude 纬度
   * @param { number} height 距离地图表面的高度 默认高度 0.001
   * @description 经纬度转换本地坐标
   */
  lngLatToLocationPosition = (
    longitude: number,
    latitude: number,
    height: number = 0.001
  ) => {
    this.geography.updatePos(
      this.earthAttr.radius + height,
      longitude,
      latitude
    );
    return this.geography.position;
  };

  /**
   * 销毁资源
   */
  destroy(): void {
    this.remove(
      this.earthEntity.mesh,
      this.startEntity.mesh,
      this.outRing.sprite,
      this.lights.ambientLight,
      this.lights.sunLight,
      this.lights.fillLight
    );
    this.lights.ambientLight.dispose();
    this.lights.fillLight.dispose();
    this.lights.sunLight.dispose();

    this.earthEntity.geometry.dispose();
    this.earthEntity.material.dispose();

    this.startEntity.geometry.dispose();
    this.startEntity.material.dispose();

    this.outRing.material.dispose();
    this.outRing.texture.dispose();

    this.editor.destroy();
  }
}
