import * as THREE from "three";

export class ParticleExplosion {
  public points: THREE.Points;
  private velocity: THREE.Vector3[] = [];
  private life = 1;

  constructor(position: THREE.Vector3, color: number) {
    const count = 40;

    const geometry = new THREE.BufferGeometry();

    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = position.x;
      positions[i * 3 + 1] = position.y;
      positions[i * 3 + 2] = position.z;

      this.velocity.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * 3,
          Math.random() * 3,
          (Math.random() - 0.5) * 3
        )
      );
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color,
      size: 0.1,
      transparent: true,
    });

    this.points = new THREE.Points(geometry, material);
  }

  update(dt: number) {
    this.life -= dt * 2;

    const positions = this.points.geometry.attributes.position
      .array as Float32Array;

    for (let i = 0; i < this.velocity.length; i++) {
      positions[i * 3] += this.velocity[i].x * dt;
      positions[i * 3 + 1] += this.velocity[i].y * dt;
      positions[i * 3 + 2] += this.velocity[i].z * dt;

      this.velocity[i].y -= 5 * dt;
    }

    this.points.geometry.attributes.position.needsUpdate = true;

    (this.points.material as THREE.PointsMaterial).opacity = this.life;

    return this.life <= 0;
  }

  dispose() {
    this.points.geometry.dispose();
    (this.points.material as THREE.Material).dispose();
  }
}
