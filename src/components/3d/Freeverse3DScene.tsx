import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import type { Theme } from '../../hooks/useTheme';

interface Freeverse3DSceneProps {
  theme: Theme;
  triggerAnimation?: boolean;
}

export default function Freeverse3DScene({ theme, triggerAnimation = false }: Freeverse3DSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Detect reduced motion & mobile screen width
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 768;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, isMobile ? 22 : 18);

    // 2. High-Performance WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = theme === 'light' ? 1.3 : 1.1;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 3. Lighting Setup (Bright Crystal vs Deep Ocean)
    const ambientLight = new THREE.AmbientLight(
      theme === 'light' ? 0xffffff : 0x07111f,
      theme === 'light' ? 1.6 : 0.8
    );
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(
      0x38bdf8,
      theme === 'light' ? 2.8 : 1.8
    );
    mainLight.position.set(12, 18, 12);
    scene.add(mainLight);

    const cyanLight = new THREE.PointLight(0x67e8f9, theme === 'light' ? 3 : 5, 35);
    cyanLight.position.set(-10, 6, 6);
    scene.add(cyanLight);

    const mintLight = new THREE.PointLight(0x6ee7c8, theme === 'light' ? 2.5 : 4, 35);
    mintLight.position.set(10, -6, -2);
    scene.add(mintLight);

    const roseLight = new THREE.PointLight(0xfda4d8, theme === 'light' ? 2 : 3.5, 30);
    roseLight.position.set(0, 10, -6);
    scene.add(roseLight);

    // 4. FREEVERSE PRISMATIC CRYSTAL CORE SCULPTURE
    const crystalGroup = new THREE.Group();
    scene.add(crystalGroup);

    // Position crystal group so it forms an immersive background hero sculpture
    if (isMobile) {
      crystalGroup.position.set(0, 2, 0);
      crystalGroup.scale.set(0.75, 0.75, 0.75);
    } else {
      crystalGroup.position.set(2.5, 0.5, 0);
    }

    // Outer Refractive Glass Geometry
    const crystalGeo = new THREE.IcosahedronGeometry(isMobile ? 2.8 : 3.6, 0);
    const posAttr = crystalGeo.attributes.position;
    for (let i = 0; i < posAttr.count; i++) {
      const x = posAttr.getX(i);
      const y = posAttr.getY(i);
      const z = posAttr.getZ(i);
      const factor = 1 + Math.sin(i * 1.8) * 0.14;
      posAttr.setXYZ(i, x * factor, y * factor, z * factor);
    }
    crystalGeo.computeVertexNormals();

    const crystalMat = new THREE.MeshPhysicalMaterial({
      color: theme === 'light' ? 0xf4f9ff : 0x0b1b2b,
      transmission: 0.94,
      opacity: 0.95,
      transparent: true,
      roughness: 0.05,
      metalness: 0.02,
      ior: 1.62,
      thickness: 2.2,
      specularIntensity: 1.2,
      specularColor: new THREE.Color(0x38bdf8),
      clearcoat: 1.0,
      clearcoatRoughness: 0.03,
      side: THREE.DoubleSide,
    });

    const crystalMesh = new THREE.Mesh(crystalGeo, crystalMat);
    crystalGroup.add(crystalMesh);

    // Inner Glowing Core Lattice
    const innerGeo = new THREE.DodecahedronGeometry(isMobile ? 1.6 : 2.1, 0);
    const innerMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x67e8f9,
      emissiveIntensity: theme === 'light' ? 0.8 : 1.5,
      wireframe: true,
      transparent: true,
      opacity: 0.75,
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    crystalGroup.add(innerMesh);

    const coreLight = new THREE.PointLight(0x67e8f9, theme === 'light' ? 4 : 6, 18);
    crystalGroup.add(coreLight);

    // 5. FOREGROUND TRANSLUCENT CRYSTAL FRAGMENTS LAYER
    const fragmentsGroup = new THREE.Group();
    scene.add(fragmentsGroup);

    const fragCount = isMobile ? 6 : 14;
    const fragGeo = new THREE.ConeGeometry(0.35, 1.1, 5);
    const fragMat = new THREE.MeshPhysicalMaterial({
      color: 0x67e8f9,
      transmission: 0.9,
      opacity: 0.85,
      transparent: true,
      roughness: 0.1,
    });

    const fragmentMeshes: THREE.Mesh[] = [];
    for (let i = 0; i < fragCount; i++) {
      const mesh = new THREE.Mesh(fragGeo, fragMat);
      mesh.position.set(
        (Math.random() - 0.5) * 22,
        (Math.random() - 0.5) * 16,
        (Math.random() - 0.5) * 10 + 2
      );
      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      const s = 0.5 + Math.random() * 0.7;
      mesh.scale.set(s, s, s);
      fragmentsGroup.add(mesh);
      fragmentMeshes.push(mesh);
    }

    // 6. ORBITING SKILL NODES & ANIMATED LIGHT BEAMS
    const nodeLabels = ['LEARN', 'CREATE', 'PROJECTS', 'PORTFOLIO', 'CONNECT', 'FREELANCE', 'OPPORTUNITY'];
    const nodesGroup = new THREE.Group();
    crystalGroup.add(nodesGroup);

    const nodeMat = new THREE.MeshStandardMaterial({
      color: 0x6ee7c8,
      emissive: 0x6ee7c8,
      emissiveIntensity: 0.9,
      roughness: 0.2,
    });

    const nodeMeshes: { mesh: THREE.Mesh; angle: number; radius: number; speed: number }[] = [];
    nodeLabels.forEach((_, idx) => {
      const geo = new THREE.SphereGeometry(0.28, 16, 16);
      const mesh = new THREE.Mesh(geo, nodeMat);
      const angle = (idx / nodeLabels.length) * Math.PI * 2;
      const radius = (isMobile ? 3.8 : 5.4) + (idx % 2 === 0 ? 0.6 : -0.4);
      const speed = 0.003 + (idx % 3) * 0.001;

      mesh.position.set(Math.cos(angle) * radius, Math.sin(angle * 2) * 1.1, Math.sin(angle) * radius);
      nodesGroup.add(mesh);
      nodeMeshes.push({ mesh, angle, radius, speed });
    });

    // Connecting Lines
    const lineGeo = new THREE.BufferGeometry();
    const linePositions = new Float32Array(nodeLabels.length * 6);
    lineGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: theme === 'light' ? 0.45 : 0.65,
    });
    const connectionLines = new THREE.LineSegments(lineGeo, lineMat);
    crystalGroup.add(connectionLines);

    // 7. AURORA PARTICLE FIELD
    const particleCount = isMobile ? 120 : (reducedMotion ? 150 : 350);
    const particleGeo = new THREE.BufferGeometry();
    const posArray = new Float32Array(particleCount * 3);
    const colorArray = new Float32Array(particleCount * 3);

    const colorPalette = [
      new THREE.Color(0x67e8f9), // Cyan
      new THREE.Color(0x38bdf8), // Sky Blue
      new THREE.Color(0x6ee7c8), // Mint
      new THREE.Color(0xfda4d8), // Soft Pink
      new THREE.Color(0xfde68a), // Gold
    ];

    for (let i = 0; i < particleCount; i++) {
      posArray[i * 3] = (Math.random() - 0.5) * 44;
      posArray[i * 3 + 1] = (Math.random() - 0.5) * 36;
      posArray[i * 3 + 2] = (Math.random() - 0.5) * 28 - 4;

      const c = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      colorArray[i * 3] = c.r;
      colorArray[i * 3 + 1] = c.g;
      colorArray[i * 3 + 2] = c.b;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));

    const particleMat = new THREE.PointsMaterial({
      size: isMobile ? 0.16 : 0.22,
      vertexColors: true,
      transparent: true,
      opacity: theme === 'light' ? 0.65 : 0.85,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 8. MOUSE & SCROLL PARALLAX ENGINE
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const onMouseMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX / window.innerWidth) * 2 - 1;
      targetMouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    let scrollY = window.scrollY;
    const onScroll = () => {
      scrollY = window.scrollY;
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    // 9. ANIMATION LOOP
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse lerping
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      if (!reducedMotion) {
        // Continuous Crystal Core Rotation
        crystalGroup.rotation.y = elapsedTime * 0.18 + mouseX * 0.4;
        crystalGroup.rotation.x = Math.sin(elapsedTime * 0.2) * 0.14 - mouseY * 0.25;

        // Inner Core counter rotation
        innerMesh.rotation.y = -elapsedTime * 0.32;
        innerMesh.rotation.z = Math.cos(elapsedTime * 0.25) * 0.2;

        // Orbiting Skill Nodes
        nodeMeshes.forEach((nodeObj, i) => {
          nodeObj.angle += nodeObj.speed;
          const currentRadius = nodeObj.radius + Math.sin(elapsedTime * 1.2 + i) * 0.25;
          nodeObj.mesh.position.x = Math.cos(nodeObj.angle) * currentRadius;
          nodeObj.mesh.position.z = Math.sin(nodeObj.angle) * currentRadius;
          nodeObj.mesh.position.y = Math.sin(nodeObj.angle * 2 + elapsedTime) * 1.1;
        });

        // Update Line connection positions
        const positions = connectionLines.geometry.attributes.position.array as Float32Array;
        nodeMeshes.forEach((nodeObj, i) => {
          const nextNode = nodeMeshes[(i + 1) % nodeMeshes.length];
          positions[i * 6] = nodeObj.mesh.position.x;
          positions[i * 6 + 1] = nodeObj.mesh.position.y;
          positions[i * 6 + 2] = nodeObj.mesh.position.z;
          positions[i * 6 + 3] = nextNode.mesh.position.x;
          positions[i * 6 + 4] = nextNode.mesh.position.y;
          positions[i * 6 + 5] = nextNode.mesh.position.z;
        });
        connectionLines.geometry.attributes.position.needsUpdate = true;

        // Foreground fragments floating animation
        fragmentMeshes.forEach((mesh, idx) => {
          mesh.rotation.x += 0.004;
          mesh.rotation.y += 0.006;
          mesh.position.y += Math.sin(elapsedTime + idx) * 0.003;
        });

        // Particle field rotation
        particles.rotation.y = elapsedTime * 0.025 + mouseX * 0.08;
      }

      // Parallax & Scroll camera displacement
      camera.position.x = mouseX * 1.5;
      camera.position.y = -scrollY * 0.005 + mouseY * 1.1;
      camera.position.z = (isMobile ? 22 : 18) + Math.sin(scrollY * 0.001) * 1.5;

      // Trigger scale burst on "ENTER THE FREEVERSE"
      if (triggerAnimation) {
        crystalGroup.scale.lerp(new THREE.Vector3(1.3, 1.3, 1.3), 0.08);
      } else {
        const baseScale = isMobile ? 0.75 : 1.0;
        crystalGroup.scale.lerp(new THREE.Vector3(baseScale, baseScale, baseScale), 0.05);
      }

      renderer.render(scene, camera);
    };
    animate();

    // 10. Window Resize Handler
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };
    window.addEventListener('resize', onResize);

    // 11. Clean Up
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(animId);

      crystalGeo.dispose();
      crystalMat.dispose();
      innerGeo.dispose();
      innerMat.dispose();
      fragGeo.dispose();
      fragMat.dispose();
      lineGeo.dispose();
      lineMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      renderer.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [theme, triggerAnimation]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
    />
  );
}
