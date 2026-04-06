import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function DnaHelixBackground() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const isMobile = window.innerWidth <= 768;

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0xffffff, 10, 25);

    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 18);

    const renderer = new THREE.WebGLRenderer({ antialias: !isMobile, alpha: true, powerPreference: 'low-power' });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(isMobile ? 1 : Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    const dnaGroup = new THREE.Group();
    if (!isMobile) dnaGroup.position.x = 4;

    const numPoints = isMobile ? 120 : 250;
    const height = 30;
    const radius = 2.5;
    const turns = isMobile ? 3 : 5;

    const points1: THREE.Vector3[] = [];
    const points2: THREE.Vector3[] = [];
    const colors1: number[] = [];
    const colors2: number[] = [];
    const pairPoints: THREE.Vector3[] = [];
    const pairColors: number[] = [];

    const bjjColors = [
      new THREE.Color(0xffffff),
      new THREE.Color(0x2563eb),
      new THREE.Color(0x9333ea),
      new THREE.Color(0x78350f),
      new THREE.Color(0x222222),
    ];
    const sdColors = [
      new THREE.Color(0xf5f5dc),
      new THREE.Color(0x800080),
      new THREE.Color(0xff0000),
      new THREE.Color(0x0000ff),
      new THREE.Color(0xffa500),
      new THREE.Color(0x008000),
      new THREE.Color(0xffff00),
      new THREE.Color(0x40e0d0),
    ];

    function getColorAtPosition(arr: THREE.Color[], t: number) {
      const s = t * (arr.length - 1);
      const i = Math.floor(s);
      if (i >= arr.length - 1) return arr[arr.length - 1].clone();
      return arr[i].clone().lerp(arr[i + 1], s - i);
    }

    for (let i = 0; i <= numPoints; i++) {
      const t = i / numPoints;
      const y = (t - 0.5) * height;
      const angle = t * Math.PI * 2 * turns;

      const x1 = Math.cos(angle) * radius;
      const z1 = Math.sin(angle) * radius;
      points1.push(new THREE.Vector3(x1, y, z1));

      const x2 = Math.cos(angle + Math.PI) * radius;
      const z2 = Math.sin(angle + Math.PI) * radius;
      points2.push(new THREE.Vector3(x2, y, z2));

      const cBJJ = getColorAtPosition(bjjColors, t);
      const cSD  = getColorAtPosition(sdColors, t);
      colors1.push(cBJJ.r, cBJJ.g, cBJJ.b);
      colors2.push(cSD.r,  cSD.g,  cSD.b);

      if (i % 4 === 0) {
        pairPoints.push(new THREE.Vector3(x1, y, z1));
        pairPoints.push(new THREE.Vector3(x2, y, z2));
        const blend = cBJJ.clone().lerp(cSD, 0.5);
        pairColors.push(blend.r, blend.g, blend.b, blend.r, blend.g, blend.b);
      }
    }

    const mat = { vertexColors: true, transparent: true, opacity: 1.0, linewidth: 3 };

    const geo1 = new THREE.BufferGeometry().setFromPoints(points1);
    geo1.setAttribute('color', new THREE.Float32BufferAttribute(colors1, 3));
    dnaGroup.add(new THREE.Line(geo1, new THREE.LineBasicMaterial(mat)));

    const geo2 = new THREE.BufferGeometry().setFromPoints(points2);
    geo2.setAttribute('color', new THREE.Float32BufferAttribute(colors2, 3));
    dnaGroup.add(new THREE.Line(geo2, new THREE.LineBasicMaterial(mat)));

    const pairGeo = new THREE.BufferGeometry().setFromPoints(pairPoints);
    pairGeo.setAttribute('color', new THREE.Float32BufferAttribute(pairColors, 3));
    dnaGroup.add(new THREE.LineSegments(pairGeo, new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.25 })));

    scene.add(dnaGroup);

    let targetRotation = 0;
    let targetPositionY = 0;
    let animationFrameId: number;
    const fpsInterval = 1000 / (isMobile ? 30 : 60);
    let lastFrameTime = 0;

    const handleScroll = () => {
      targetRotation  = window.scrollY * 0.003;
      targetPositionY = window.scrollY * 0.005;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    const animate = (now: number) => {
      animationFrameId = requestAnimationFrame(animate);
      if (now - lastFrameTime < fpsInterval) return;
      lastFrameTime = now;
      dnaGroup.rotation.y += 0.002;
      dnaGroup.rotation.y += (targetRotation - dnaGroup.rotation.y) * 0.08;
      dnaGroup.position.y += (targetPositionY - dnaGroup.position.y) * 0.08;
      renderer.render(scene, camera);
    };
    animate(0);

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      dnaGroup.position.x = window.innerWidth <= 768 ? 0 : 4;
    };
    window.addEventListener('resize', handleResize);

    const currentMount = mountRef.current;
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (currentMount) currentMount.removeChild(renderer.domElement);
      geo1.dispose(); geo2.dispose(); pairGeo.dispose(); renderer.dispose();
    };
  }, []);

  return <div id="canvas-container" ref={mountRef} />;
}
