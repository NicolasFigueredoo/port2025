import { useEffect, useRef } from "react";
import * as THREE from "three";
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const FbxViewer = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const modelRef = useRef<THREE.Object3D | null>(null); // Referencia al modelo

  useEffect(() => {
    if (!mountRef.current) return;

    // Crear escena, cámara y renderizador
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000); // Relación 1:1
    camera.position.set(0, 1, 7);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(800, 800); // Ajusta el tamaño del canvas
    renderer.setClearColor(0x000000, 0); // Hace el fondo transparente
    mountRef.current.appendChild(renderer.domElement);

    // Agregar luces
    const light = new THREE.AmbientLight(0xffffff, 1);
    scene.add(light);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Cargar modelo FBX
    const loader = new FBXLoader();
    loader.load("/public/Case.fbx", (object) => {
      object.scale.set(0.01, 0.01, 0.01); // Ajusta el tamaño
      modelRef.current = object; // Guardamos referencia al modelo
      scene.add(object);
    });

    // Controles de órbita
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = 0.5;
    controls.zoomSpeed = 1;
    controls.enableZoom = true;

    // Animación
    const animate = () => {
      requestAnimationFrame(animate);

      // Rotación automática del modelo
      if (modelRef.current) {
        modelRef.current.rotation.y += 0.005; // Ajusta la velocidad de rotación
      }

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      mountRef.current?.removeChild(renderer.domElement);
      controls.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="w-[600px] h-[600px] bg-transparent mx-auto"
    />
  );
};

export default FbxViewer;
