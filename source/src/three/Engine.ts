import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Game, Tile } from "./Game";
import backgroundImage from "../../assets/background-compressed.jpg";

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
  private textTextures = new Map();

  private game: Game;
  private hexagons: HexMesh[] = [];

  private readonly hexSize = 1;

  constructor(private container: HTMLDivElement, private radius: number) {
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
    this.camera.rotation.set(-0.829, -0.39, -0.393);

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
    });

    this.renderer.setSize(container.clientWidth, container.clientHeight);

    container.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;

    this.game = new Game(radius);

    this.init();

    this.animate();
  }

  private init() {
    this.createBoard();

    const light = new THREE.PointLight(0xffffff, 15);

    light.position.set(3, 3, 0);

    this.scene.add(light);

    this.addBackground();

    this.scene.add(new THREE.AmbientLight(0xffffff, 0.5));

    // this.scene.add(new THREE.AxesHelper(10));
  }

  public getGame() {
    return this.game;
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
      const sideMaterial = new THREE.MeshStandardMaterial({
        color: this.getTileColor(tile.value),
      });

      const topMaterial = new THREE.MeshPhysicalMaterial({
        transparent: true,
        opacity: 0.85,

        transmission: 0.2,
        roughness: 0.15,

        clearcoat: 1,
        clearcoatRoughness: 0.1,
      });

      const materials = [
        sideMaterial, // side
        topMaterial, // top
        topMaterial, // bottom
      ];

      const mesh = new THREE.Mesh(geometry, materials);

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
    const tiles = this.game.getCurrentFrame();

    tiles.forEach((tile) => {
      const hex = this.hexagons.find((h) => h.q === tile.q && h.r === tile.r);

      if (!hex) {
        return;
      }

      const materials = hex.mesh.material as THREE.MeshStandardMaterial[];

      const sideMaterial = materials[0];
      const topMaterial = materials[1];
      const bottomMaterial = materials[2];

      // update color
      sideMaterial.color.set(this.getTileColor(tile.value));
      topMaterial.map = this.getTextTexture(tile);
      bottomMaterial.map = this.getTextTexture(tile);

      topMaterial.needsUpdate = true;
    });
  }

  private getTileColor(value: number): number {
    switch (value) {
      case 0:
        return 0xd4d0c8; // XP window gray

      case 2:
        return 0x00a651; // XP green

      case 4:
        return 0x0078d7; // XP blue

      case 8:
        return 0xfdb813; // XP yellow

      case 16:
        return 0xed1c24; // XP red

      case 32:
        return 0x33cc66; // bright green

      case 64:
        return 0x3399ff; // sky blue

      case 128:
        return 0xffcc33; // golden yellow

      case 256:
        return 0xff6666; // soft red

      case 512:
        return 0x66ccff; // light blue

      case 1024:
        return 0x99cc33; // lime green

      case 2048:
        return 0xff9933; // orange XP sunset

      default:
        return 0x666666;
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

  private createTextTexture(tile: Tile): THREE.CanvasTexture {
    const size = 256;

    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;

    const ctx = canvas.getContext("2d")!;

    // background
    ctx.fillStyle = `#${this.getTileColor(tile.value)
      .toString(16)
      .padStart(6, "0")}`;
    ctx.fillRect(0, 0, size, size);

    // move origin to center
    ctx.translate(size / 2, size / 2);
    ctx.rotate(-(Math.PI / 3));

    // text
    ctx.fillStyle = tile.value <= 4 ? "#000000" : "#ffffff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const fontSize = tile.value >= 1000 ? 60 : tile.value >= 100 ? 75 : 90;
    ctx.font = `bold ${fontSize}px Tahoma, Arial`;

    const gradient = ctx.createLinearGradient(0, 0, size, size);

    const base = this.getTileColor(tile.value);
    const hex = `#${base.toString(16).padStart(6, "0")}`;

    gradient.addColorStop(0, "#ffffff");
    gradient.addColorStop(0.3, hex);
    gradient.addColorStop(1, "#7aa7d9");

    if (tile.value > 0) {
      ctx.fillText(tile.value.toString(), 0, 0);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;

    return texture;
  }

  private getTextTexture(tile: Tile) {
    if (!this.textTextures.has(tile.value)) {
      this.textTextures.set(tile.value, this.createTextTexture(tile));
    }
    return this.textTextures.get(tile.value)!;
  }

  private addBackground() {
    const textureLoader = new THREE.TextureLoader();

    const texture = textureLoader.load(backgroundImage);

    const geometry = new THREE.SphereGeometry(100, 32, 32);

    geometry.scale(-1, 1, 1);

    const material = new THREE.MeshBasicMaterial({
      map: texture,
    });

    const sky = new THREE.Mesh(geometry, material);

    this.scene.add(sky);
  }

  public dispose() {
    this.game.dispose();

    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }

    window.removeEventListener("resize", this.resize);

    this.renderer.dispose();

    this.container.innerHTML = "";
  }
}
