import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Play, Pause, Box, Activity } from 'lucide-react';

interface Viewer3DProps {
  modelUrl: string;
  wireframe: boolean;
  textureView: boolean;
  inspectBones: boolean;
  resetTrigger: number;
}

export const Viewer3D: React.FC<Viewer3DProps> = ({ 
  modelUrl,
  wireframe, 
  textureView, 
  inspectBones,
  resetTrigger 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const modelRef = useRef<THREE.Group | null>(null);
  const skeletonHelperRef = useRef<THREE.SkeletonHelper | null>(null);
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [animations, setAnimations] = useState<THREE.AnimationClip[]>([]);
  const [isPlaying, setIsPlaying] = useState(true);
  const [stats, setStats] = useState({ tris: 0, vertices: 0, meshCount: 0 });

  // Derive model name from URL
  const modelFileName = modelUrl.split('/').pop() || 'Unknown Model';

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0a);
    sceneRef.current = scene;
    
    const grid = new THREE.GridHelper(30, 60, 0x222222, 0x111111);
    scene.add(grid);

    const camera = new THREE.PerspectiveCamera(
      45, 
      containerRef.current.clientWidth / containerRef.current.clientHeight, 
      0.1, 
      1000
    );
    camera.position.set(6, 4, 6);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controlsRef.current = controls;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);
    
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
    keyLight.position.set(10, 20, 10);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x3b82f6, 0.8);
    rimLight.position.set(-10, 10, -10);
    scene.add(rimLight);

    const loader = new GLTFLoader();
    setLoading(true);
    
    loader.load(
      modelUrl,
      (gltf) => {
        const model = gltf.scene;
        modelRef.current = model;

        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 4 / maxDim;
        model.scale.setScalar(scale);
        model.position.sub(center.multiplyScalar(scale));
        model.position.y = 0;

        scene.add(model);

        let triCount = 0;
        let vertCount = 0;
        let meshCount = 0;
        model.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            meshCount++;
            if (child.geometry.attributes.position) {
              triCount += child.geometry.index 
                ? child.geometry.index.count / 3 
                : child.geometry.attributes.position.count / 3;
              vertCount += child.geometry.attributes.position.count;
            }
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });
        setStats({ tris: Math.round(triCount), vertices: vertCount, meshCount });

        if (gltf.animations.length > 0) {
          const mixer = new THREE.AnimationMixer(model);
          const action = mixer.clipAction(gltf.animations[0]);
          action.play();
          mixerRef.current = mixer;
          setAnimations(gltf.animations);
        }

        const skeletonHelper = new THREE.SkeletonHelper(model);
        skeletonHelper.visible = false;
        scene.add(skeletonHelper);
        skeletonHelperRef.current = skeletonHelper;

        setLoading(false);
      },
      undefined,
      (error) => {
        console.error('Loader error:', error);
        setLoading(false);
      }
    );

    const clock = new THREE.Clock();
    const animate = () => {
      requestAnimationFrame(animate);
      const delta = clock.getDelta();
      
      if (mixerRef.current) mixerRef.current.update(delta);
      if (controlsRef.current) controlsRef.current.update();
      if (rendererRef.current && cameraRef.current) {
        rendererRef.current.render(scene, cameraRef.current);
      }
    };
    animate();

    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (containerRef.current && renderer.domElement.parentNode) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, [modelUrl]);

  useEffect(() => {
    if (!modelRef.current) return;
    modelRef.current.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        if (child.material) {
          const materials = Array.isArray(child.material) ? child.material : [child.material];
          materials.forEach((m: any) => {
            m.wireframe = wireframe;
            if (!textureView) {
              if (!m.userData.originalColor) m.userData.originalColor = m.color?.clone() || new THREE.Color(0xffffff);
              m.color?.set(0x333333);
            } else if (m.userData.originalColor) {
              m.color?.copy(m.userData.originalColor);
            }
          });
        }
      }
    });
    if (skeletonHelperRef.current) skeletonHelperRef.current.visible = inspectBones;
  }, [wireframe, textureView, inspectBones]);

  useEffect(() => {
    if (cameraRef.current && controlsRef.current && resetTrigger > 0) {
      cameraRef.current.position.set(6, 4, 6);
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  }, [resetTrigger]);

  const toggleAnimation = () => {
    if (mixerRef.current) {
      mixerRef.current.timeScale = isPlaying ? 0 : 1;
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="relative w-full h-full group/internal">
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing outline-none" />
      
      {/* Model Name & ID Overlay */}
      <div className="absolute top-8 left-8 flex flex-col gap-2 pointer-events-none">
        <div className="flex items-center gap-3 bg-black/60 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-2xl shadow-2xl">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
            <Box className="w-4 h-4 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 leading-none">Primary Instance</span>
            <span className="text-sm font-black text-white uppercase tracking-tighter">{modelFileName}</span>
          </div>
        </div>
        {!loading && (
          <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full w-fit">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
            <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Active Buffer: OK</span>
          </div>
        )}
      </div>

      {/* Stats Overlay */}
      {!loading && (
        <div className="absolute top-8 right-8 flex flex-col items-end gap-1 font-black text-[9px] uppercase tracking-widest text-gray-500 pointer-events-none">
          <div className="flex items-center gap-2">
            <span>Vertices:</span>
            <span className="text-gray-200">{(stats.vertices / 1000).toFixed(1)}K</span>
          </div>
          <div className="flex items-center gap-2">
            <span>Triangles:</span>
            <span className="text-blue-500">{(stats.tris / 1000).toFixed(1)}K</span>
          </div>
          <div className="flex items-center gap-2">
            <span>Sub-Meshes:</span>
            <span className="text-gray-200">{stats.meshCount}</span>
          </div>
        </div>
      )}

      {/* Animation Controller */}
      {animations.length > 0 && (
        <div className="absolute bottom-8 right-8 flex items-center gap-4 bg-black/60 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-2xl opacity-0 group-hover/internal:opacity-100 transition-all shadow-2xl">
          <button 
            onClick={toggleAnimation}
            className="p-2 hover:bg-blue-600 rounded-lg transition-all text-white"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
          </button>
          <div className="h-4 w-px bg-white/10"></div>
          <div className="flex flex-col">
            <span className="text-[9px] font-black uppercase tracking-widest text-blue-400">Sequence Loaded</span>
            <span className="text-[8px] font-black text-gray-500 uppercase">{animations[0].name || 'Main Clip'}</span>
          </div>
        </div>
      )}

      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-md z-10">
          <div className="flex flex-col items-center gap-6">
            <div className="relative">
              <div className="w-12 h-12 border-4 border-blue-600/20 rounded-full"></div>
              <div className="absolute top-0 w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-400 animate-pulse">Initializing VRAM...</span>
              <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest mt-2">Loading: {modelFileName}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};