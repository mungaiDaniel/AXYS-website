'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ThreeJSVisualization() {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setClearColor(0x000000, 0.1);
    containerRef.current.appendChild(renderer.domElement);

    camera.position.z = 12;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x00bcd4, 1);
    pointLight1.position.set(10, 10, 10);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x1477bb, 0.8);
    pointLight2.position.set(-10, -5, 5);
    scene.add(pointLight2);

    // Create floating cubes
    const geometries = [
      new THREE.BoxGeometry(1.5, 1.5, 1.5),
      new THREE.OctahedronGeometry(1),
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.OctahedronGeometry(0.8),
      new THREE.BoxGeometry(1.2, 1.2, 1.2),
    ];

    const materials = [
      new THREE.MeshPhongMaterial({ color: 0x00bcd4, emissive: 0x004d66, wireframe: false }),
      new THREE.MeshPhongMaterial({ color: 0x1477bb, emissive: 0x0a3d6f, wireframe: false }),
      new THREE.MeshPhongMaterial({ color: 0x00e5ff, emissive: 0x006699, wireframe: false }),
      new THREE.MeshPhongMaterial({ color: 0x0095b6, emissive: 0x004d73, wireframe: false }),
      new THREE.MeshPhongMaterial({ color: 0x00d4ff, emissive: 0x005580, wireframe: false }),
    ];

    const meshes = [];
    for (let i = 0; i < 5; i++) {
      const mesh = new THREE.Mesh(geometries[i], materials[i]);
      mesh.position.set(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 15
      );
      mesh.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
      
      // Store velocity for floating effect
      mesh.velocity = {
        x: (Math.random() - 0.5) * 0.01,
        y: (Math.random() - 0.5) * 0.01,
        z: (Math.random() - 0.5) * 0.01,
      };
      mesh.rotationVelocity = {
        x: (Math.random() - 0.5) * 0.005,
        y: (Math.random() - 0.5) * 0.005,
        z: (Math.random() - 0.5) * 0.005,
      };

      scene.add(mesh);
      meshes.push(mesh);
    }

    // Add wireframe central sphere
    const sphereGeometry = new THREE.SphereGeometry(3, 32, 32);
    const sphereMaterial = new THREE.MeshBasicMaterial({
      color: 0x00bcd4,
      wireframe: true,
      transparent: true,
      opacity: 0.2,
    });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    scene.add(sphere);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      // Rotate and move cubes
      meshes.forEach((mesh) => {
        mesh.rotation.x += mesh.rotationVelocity.x;
        mesh.rotation.y += mesh.rotationVelocity.y;
        mesh.rotation.z += mesh.rotationVelocity.z;

        mesh.position.x += mesh.velocity.x;
        mesh.position.y += mesh.velocity.y;
        mesh.position.z += mesh.velocity.z;

        // Bounce boundaries
        const boundary = 10;
        if (mesh.position.x > boundary || mesh.position.x < -boundary) {
          mesh.velocity.x *= -1;
        }
        if (mesh.position.y > boundary || mesh.position.y < -boundary) {
          mesh.velocity.y *= -1;
        }
        if (mesh.position.z > boundary || mesh.position.z < -boundary) {
          mesh.velocity.z *= -1;
        }
      });

      // Rotate wireframe sphere
      sphere.rotation.x += 0.0005;
      sphere.rotation.y += 0.001;

      renderer.render(scene, camera);
    };
    animate();

    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (containerRef.current && renderer.domElement.parentNode === containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '400px',
        borderRadius: '12px',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, rgba(20, 119, 187, 0.1) 0%, rgba(0, 188, 212, 0.05) 100%)',
        border: '1px solid rgba(0, 188, 212, 0.2)',
      }}
    />
  );
}
