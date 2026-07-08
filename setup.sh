#!/bin/bash

set -e

PROJECT_NAME="source"

echo "Creating Vite 5 React + TypeScript project..."

npm create vite@5 $PROJECT_NAME -- --template react-ts

cd $PROJECT_NAME

echo "Installing dependencies..."
npm install

echo "Installing Three.js..."
npm install three

echo "Creating project structure..."

mkdir -p src/three
mkdir -p src/components

echo "Creating Engine.ts..."

cat > src/three/Engine.ts << 'EOF'
import * as THREE from 'three'

export class Engine {
  private scene: THREE.Scene
  private camera: THREE.PerspectiveCamera
  private renderer: THREE.WebGLRenderer
  private animationId?: number

  constructor(private container: HTMLDivElement) {
    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color(0x202020)

    this.camera = new THREE.PerspectiveCamera(
      75,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    )

    this.camera.position.z = 5

    this.renderer = new THREE.WebGLRenderer({
      antialias: true
    })

    this.renderer.setSize(
      container.clientWidth,
      container.clientHeight
    )

    container.appendChild(this.renderer.domElement)

    this.init()
    this.animate()

    window.addEventListener('resize', this.resize)
  }

  private init() {
    const geometry = new THREE.BoxGeometry()

    const material = new THREE.MeshStandardMaterial({
      color: 0xff6600
    })

    const cube = new THREE.Mesh(
      geometry,
      material
    )

    this.scene.add(cube)

    const light = new THREE.PointLight(
      0xffffff,
      10
    )

    light.position.set(5, 5, 5)

    this.scene.add(light)
    this.scene.add(
      new THREE.AmbientLight(0xffffff, 0.5)
    )

    this.scene.userData.cube = cube
  }

  private animate = () => {
    this.animationId = requestAnimationFrame(
      this.animate
    )

    const cube = this.scene.userData.cube as THREE.Mesh

    cube.rotation.x += 0.01
    cube.rotation.y += 0.01

    this.renderer.render(
      this.scene,
      this.camera
    )
  }

  private resize = () => {
    const width = this.container.clientWidth
    const height = this.container.clientHeight

    this.camera.aspect = width / height
    this.camera.updateProjectionMatrix()

    this.renderer.setSize(
      width,
      height
    )
  }

  public dispose() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId)
    }

    window.removeEventListener(
      'resize',
      this.resize
    )

    this.renderer.dispose()

    this.container.innerHTML = ''
  }
}
EOF


echo "Creating ThreeCanvas.tsx..."

cat > src/components/ThreeCanvas.tsx << 'EOF'
import { useEffect, useRef } from 'react'
import { Engine } from '../three/Engine'

export default function ThreeCanvas() {
  const container = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!container.current) {
      return
    }

    const engine = new Engine(container.current)

    return () => {
      engine.dispose()
    }
  }, [])

  return (
    <div
      ref={container}
      style={{
        width: '100vw',
        height: '100vh'
      }}
    />
  )
}
EOF


echo "Updating App.tsx..."

cat > src/App.tsx << 'EOF'
import ThreeCanvas from './components/ThreeCanvas'

export default function App() {
  return <ThreeCanvas />
}
EOF


echo "Removing default Vite assets..."

rm -rf src/assets
rm -f src/App.css


echo ""
echo "=================================="
echo "Three.js React project created!"
echo "=================================="
echo ""
echo "Run:"
echo "cd $PROJECT_NAME"
echo "npm run dev"
