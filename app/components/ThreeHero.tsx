'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ThreeHero() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0, 7);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.35));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    const geometry = new THREE.IcosahedronGeometry(1.55, 3);
    const material = new THREE.MeshStandardMaterial({
      color: 0x7cf7ad,
      roughness: 0.34,
      metalness: 0.66,
      emissive: 0x174f2e,
      emissiveIntensity: 0.34,
      wireframe: true,
    });
    const core = new THREE.Mesh(geometry, material);
    group.add(core);

    const solidMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.09,
      roughness: 0.16,
      metalness: 0.2,
      transmission: 0.42,
      thickness: 1.2,
    });
    const shell = new THREE.Mesh(new THREE.IcosahedronGeometry(1.42, 2), solidMaterial);
    group.add(shell);

    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0xd6b36a,
      transparent: true,
      opacity: 0.46,
      side: THREE.DoubleSide,
    });
    const rings = [2.3, 2.75, 3.18].map((radius, index) => {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(radius, 0.009, 12, 160), ringMaterial.clone());
      ring.rotation.x = Math.PI / 2.25 + index * 0.26;
      ring.rotation.y = index * 0.42;
      group.add(ring);
      return ring;
    });

    const particlesGeometry = new THREE.BufferGeometry();
    const particleCount = 54;
    const positions = new Float32Array(particleCount * 3);
    for (let index = 0; index < particleCount; index += 1) {
      const radius = 2.4 + Math.random() * 2.2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[index * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[index * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[index * 3 + 2] = radius * Math.cos(phi);
    }
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particles = new THREE.Points(
      particlesGeometry,
      new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.035,
        transparent: true,
        opacity: 0.72,
      })
    );
    group.add(particles);

    const keyLight = new THREE.PointLight(0x5eead4, 28, 20);
    keyLight.position.set(3, 3, 5);
    scene.add(keyLight);
    const fillLight = new THREE.PointLight(0xd6b36a, 10, 16);
    fillLight.position.set(-4, -2, 4);
    scene.add(fillLight);
    scene.add(new THREE.AmbientLight(0xffffff, 0.8));

    let frame = 0;
    let pointerX = 0;
    let pointerY = 0;

    const resize = () => {
      const { width, height } = mount.getBoundingClientRect();
      renderer.setSize(width, height, false);
      camera.aspect = width / Math.max(height, 1);
      camera.updateProjectionMatrix();
    };

    const handlePointerMove = (event: PointerEvent) => {
      const rect = mount.getBoundingClientRect();
      pointerX = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      pointerY = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    };

    const animate = () => {
      frame = window.requestAnimationFrame(animate);
      const time = performance.now() * 0.001;

      group.rotation.y += (pointerX * 0.25 - group.rotation.y) * 0.018;
      group.rotation.x += (-pointerY * 0.18 - group.rotation.x) * 0.018;
      core.rotation.y = time * 0.42;
      core.rotation.x = time * 0.22;
      shell.rotation.y = -time * 0.24;
      particles.rotation.y = time * 0.05;

      // Pulsing effect for shell opacity and scale
      const pulseIntensity = Math.sin(time * 1.2) * 0.15 + 0.85;
      shell.material.opacity = 0.09 * pulseIntensity;
      shell.scale.set(pulseIntensity * 0.98, pulseIntensity * 0.98, pulseIntensity * 0.98);

      // Breathing effect for core emissive intensity
      const breatheIntensity = Math.sin(time * 0.8) * 0.2 + 0.42;
      core.material.emissiveIntensity = breatheIntensity;

      // Pulsing particle opacity
      const particlePulse = Math.sin(time * 1.5) * 0.15 + 0.72;
      particles.material.opacity = particlePulse;

      rings.forEach((ring, index) => {
        ring.rotation.z = time * (0.18 + index * 0.05);
        // Ring opacity pulse at different rates
        const ringPulse = Math.sin(time * (1.0 + index * 0.2)) * 0.2 + 0.52;
        ring.material.opacity = ringPulse;
      });

      renderer.render(scene, camera);
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(mount);

    resize();
    animate();
    window.addEventListener('resize', resize);
    mount.addEventListener('pointermove', handlePointerMove);

    return () => {
      window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      window.removeEventListener('resize', resize);
      mount.removeEventListener('pointermove', handlePointerMove);
      renderer.dispose();
      geometry.dispose();
      solidMaterial.dispose();
      material.dispose();
      ringMaterial.dispose();
      particlesGeometry.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="three-hero" aria-hidden="true" />;
}
