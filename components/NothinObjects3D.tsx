"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export default function NothinObjects3D() {
  const mountRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !mountRef.current) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Dimensions
    let width = mountRef.current.clientWidth || window.innerWidth;
    let height = mountRef.current.clientHeight || window.innerHeight;

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, 8.5);

    // WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;

    // Lighting (Studio Fashion & Metallic Reflections)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.8);
    keyLight.position.set(4, 6, 5);
    scene.add(keyLight);

    const rimCyanLight = new THREE.DirectionalLight(0x70d6ff, 3.2);
    rimCyanLight.position.set(-5, -3, -2);
    scene.add(rimCyanLight);

    const fillPinkLight = new THREE.PointLight(0xff70a6, 2.5, 20);
    fillPinkLight.position.set(3, -4, 4);
    scene.add(fillPinkLight);

    // Group for objects
    const clusterGroup = new THREE.Group();
    scene.add(clusterGroup);

    // =========================================================================
    // 1. Crinkled Metallic Foil Ring (Silver Chrome)
    // =========================================================================
    const torusGeo = new THREE.TorusGeometry(1.2, 0.42, 36, 80);
    // Deform vertices for crinkled foil texture
    const posAttr = torusGeo.attributes.position;
    for (let i = 0; i < posAttr.count; i++) {
      const u = i * 0.15;
      const noise = Math.sin(u * 12.0) * Math.cos(u * 7.0) * 0.055;
      posAttr.setXYZ(
        i,
        posAttr.getX(i) + noise,
        posAttr.getY(i) + noise,
        posAttr.getZ(i) + noise
      );
    }
    torusGeo.computeVertexNormals();

    const chromeMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0xf0f4f8),
      metalness: 0.98,
      roughness: 0.12,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      reflectivity: 1.0,
    });

    const foilTorus = new THREE.Mesh(torusGeo, chromeMaterial);
    foilTorus.position.set(2.2, 0.8, 0);
    foilTorus.rotation.set(0.6, 0.4, 0.2);
    clusterGroup.add(foilTorus);

    // =========================================================================
    // 2. Inflatable Chrome Asterisk Balloon
    // =========================================================================
    const asteriskGroup = new THREE.Group();
    const balloonMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0xecf0f5),
      metalness: 0.96,
      roughness: 0.08,
      clearcoat: 1.0,
      clearcoatRoughness: 0.04,
    });

    // 3 pill capsules rotated into an asterisk
    for (let i = 0; i < 3; i++) {
      const capsuleGeo = new THREE.CapsuleGeometry(0.32, 1.4, 16, 32);
      const capsule = new THREE.Mesh(capsuleGeo, balloonMat);
      capsule.rotation.z = (i * Math.PI) / 3;
      asteriskGroup.add(capsule);
    }
    asteriskGroup.position.set(-2.4, -0.6, 0.4);
    asteriskGroup.rotation.set(-0.3, 0.5, 0.2);
    clusterGroup.add(asteriskGroup);

    // =========================================================================
    // 3. Glossy Translucent Pink / Mauve Cream Dollop (Vinyl Blob)
    // =========================================================================
    const blobGeo = new THREE.IcosahedronGeometry(0.9, 24);
    const blobPos = blobGeo.attributes.position;
    for (let i = 0; i < blobPos.count; i++) {
      const vx = blobPos.getX(i);
      const vy = blobPos.getY(i);
      const vz = blobPos.getZ(i);
      const wave = Math.sin(vx * 3.5) * Math.sin(vy * 3.5) * 0.12;
      blobPos.setXYZ(i, vx + wave, vy + wave, vz + wave);
    }
    blobGeo.computeVertexNormals();

    const pinkGlossMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0xf57ca0),
      metalness: 0.15,
      roughness: 0.14,
      transmission: 0.65,
      thickness: 1.4,
      ior: 1.48,
      specularColor: new THREE.Color(0xffffff),
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
    });

    const pinkBlob = new THREE.Mesh(blobGeo, pinkGlossMaterial);
    pinkBlob.position.set(0.2, -1.6, 1.2);
    clusterGroup.add(pinkBlob);

    // =========================================================================
    // 4. Floating Chrome Candy Shard / Capsule
    // =========================================================================
    const shardGeo = new THREE.CylinderGeometry(0.35, 0.45, 1.6, 32);
    const shardMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0xdce3ea),
      metalness: 0.98,
      roughness: 0.16,
      clearcoat: 1.0,
    });
    const shardMesh = new THREE.Mesh(shardGeo, shardMat);
    shardMesh.position.set(-0.6, 2.0, -0.8);
    shardMesh.rotation.set(0.9, 0.4, -0.6);
    clusterGroup.add(shardMesh);

    // Animation & Mouse Parallax
    let mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    let scrollY = 0;
    let isVisible = true;

    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    const handleScroll = () => {
      scrollY = window.scrollY;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Visibility observer to save battery/GPU
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    });
    observer.observe(mountRef.current);

    // Clock
    const clock = new THREE.Clock();
    let frameId = 0;

    const render = () => {
      frameId = requestAnimationFrame(render);
      if (!isVisible) return;

      const t = clock.getElapsedTime();

      // Smooth mouse lerping
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      // Parallax camera tilt
      if (!prefersReducedMotion) {
        camera.position.x = mouse.x * 0.6;
        camera.position.y = mouse.y * 0.6;
        camera.lookAt(0, 0, 0);

        // Organic idle tumble & float physics
        foilTorus.rotation.x = 0.6 + Math.sin(t * 0.8) * 0.25;
        foilTorus.rotation.y = 0.4 + t * 0.35;
        foilTorus.position.y = 0.8 + Math.sin(t * 1.2) * 0.15 - (scrollY * 0.0008);

        asteriskGroup.rotation.z = t * 0.2;
        asteriskGroup.rotation.y = 0.5 + Math.sin(t * 0.9) * 0.2;
        asteriskGroup.position.y = -0.6 + Math.cos(t * 1.1) * 0.18 - (scrollY * 0.0006);

        pinkBlob.rotation.x = t * 0.4;
        pinkBlob.rotation.y = t * 0.3;
        pinkBlob.position.y = -1.6 + Math.sin(t * 1.4) * 0.12 - (scrollY * 0.001);

        shardMesh.rotation.x = 0.9 + t * 0.25;
        shardMesh.rotation.z = -0.6 + Math.cos(t * 0.7) * 0.2;
        shardMesh.position.y = 2.0 + Math.sin(t * 1.0) * 0.16 - (scrollY * 0.0005);

        // Subtle cluster drift with mouse
        clusterGroup.rotation.y = mouse.x * 0.2;
        clusterGroup.rotation.x = -mouse.y * 0.15;
      }

      renderer.render(scene, camera);
    };

    render();

    // Resize handler
    const handleResize = () => {
      if (!mountRef.current || !renderer || !camera) return;
      width = mountRef.current.clientWidth || window.innerWidth;
      height = mountRef.current.clientHeight || window.innerHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      observer.disconnect();

      // Dispose Three.js objects
      torusGeo.dispose();
      blobGeo.dispose();
      shardGeo.dispose();
      chromeMaterial.dispose();
      balloonMat.dispose();
      pinkGlossMaterial.dispose();
      shardMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-hidden"
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}
