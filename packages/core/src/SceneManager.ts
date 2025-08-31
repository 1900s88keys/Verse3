import { Scene, Mesh } from "three";
import { Editor } from "./Editor";

export class SceneManager {
  scene: Scene;

  constructor(private editor: Editor) {
    this.scene = new Scene();
  }

  destroy(): void {
    // 从场景中移除所有对象
    if (this.scene) {
      // 递归清理场景中的所有对象
      this.scene.traverse((object) => {
        if (object instanceof Mesh) {
          if (object.geometry) {
            object.geometry.dispose();
          }
          if (object.material) {
            if (Array.isArray(object.material)) {
              object.material.forEach((material) => material.dispose());
            } else {
              object.material.dispose();
            }
          }
        }
      });

      // 清空场景
      this.scene.clear();
    }
  }
}
