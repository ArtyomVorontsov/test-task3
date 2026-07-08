import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Game } from "./Game";

type HexMesh = {
  q: number;
  r: number;
  mesh: THREE.Mesh;
};

export class Engine {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private controls: OrbitControls;

  private animationId?: number;

  private game: Game;
  private hexagons: HexMesh[] = [];

  private readonly hexSize = 1;

  constructor(private container: HTMLDivElement) {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x202020);

    this.camera = new THREE.PerspectiveCamera(
      75,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );

    this.camera.position.set(-2, 3, 3);

    this.camera.lookAt(0, 0, 0);
    console.log(this.camera.rotation);
    this.camera.rotation.set(-0.829, -0.39, -0.393);

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
    });

    this.renderer.setSize(container.clientWidth, container.clientHeight);

    container.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;

    this.game = new Game(1);

    this.init();

    this.animate();
  }

  private init() {
    this.createBoard();

    const light = new THREE.PointLight(0xffffff, 10);

    light.position.set(5, 5, 5);

    this.scene.add(light);

    this.scene.add(new THREE.AmbientLight(0xffffff, 0.5));

    this.scene.add(new THREE.AxesHelper(10));
  }

  private createBoard() {
    const geometry = new THREE.CylinderGeometry(
      this.hexSize,
      this.hexSize,
      0.3,
      6
    );

    const tiles = this.game.getMap();

    tiles.forEach((tile) => {
      const material = new THREE.MeshStandardMaterial({
        color: this.getTileColor(tile.value),
      });

      const mesh = new THREE.Mesh(geometry, material);

      const position = this.hexToWorld(tile.q, tile.r);

      mesh.position.set(position[1], position[2], position[0]);

      this.hexagons.push({
        q: tile.q,
        r: tile.r,
        mesh,
      });

      this.scene.add(mesh);
    });
  }

  private updateBoard() {
    const tiles = this.game.getMap();

    tiles.forEach((tile) => {
      const hex = this.hexagons.find((h) => h.q === tile.q && h.r === tile.r);

      if (!hex) {
        return;
      }

      const material = hex.mesh.material as THREE.MeshStandardMaterial;

      material.color.set(this.getTileColor(tile.value));
    });
  }

  private getTileColor(value: number): number {
    switch (value) {
      case 0:
        return 0xcccccc;

      case 2:
        return 0xeee4da;

      case 4:
        return 0xede0c8;

      case 8:
        return 0xf2b179;

      case 16:
        return 0xf59563;

      case 32:
        return 0xf67c5f;

      case 64:
        return 0xf65e3b;

      case 128:
        return 0xedcf72;

      case 256:
        return 0xedcc61;

      case 512:
        return 0xedc850;

      case 1024:
        return 0xedc53f;

      case 2048:
        return 0xedc22e;

      default:
        return 0x3c3a32;
    }
  }

  private hexToWorld(q: number, r: number): [number, number, number] {
    const x = this.hexSize * (3 / 2) * q;

    const y = this.hexSize * Math.sqrt(3) * (r + q / 2);

    return [x, y, 0];
  }

  private animate = () => {
    this.animationId = requestAnimationFrame(this.animate);

    this.controls.update();

    this.updateBoard();

    this.renderer.render(this.scene, this.camera);
  };

  private resize = () => {
    const width = this.container.clientWidth;

    const height = this.container.clientHeight;

    this.camera.aspect = width / height;

    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
  };

  public dispose() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }

    window.removeEventListener("resize", this.resize);

    this.renderer.dispose();

    this.container.innerHTML = "";
  }
}
