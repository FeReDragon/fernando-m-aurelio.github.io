// Fonte do 3D. O navegador carrega js/scene3d.bundle.js; depois de editar, gere de novo (ver README).
import * as THREE from 'three';
import { GLTFLoader } from './vendor/three/loaders/GLTFLoader.js';

// Failures are recorded here so they can be inspected from the console.
window.__3dErrors ??= [];
const report = (label, err) => {
    window.__3dErrors.push(`${label}: ${err?.stack || err?.message || err}`);
    console.warn(label, err);
};

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isMobile = window.matchMedia('(max-width: 900px)').matches;
const pixelRatio = Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2);

// Pointer normalized to [-1, 1], shared by both scenes.
const pointer = { x: 0, y: 0, lastMove: 0 };
window.addEventListener('pointermove', e => {
    pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
    pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
    pointer.lastMove = performance.now();
}, { passive: true });

function webglAvailable() {
    try {
        const c = document.createElement('canvas');
        return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')));
    } catch {
        return false;
    }
}

function softDot() {
    const size = 64;
    const c = document.createElement('canvas');
    c.width = c.height = size;
    const ctx = c.getContext('2d');
    const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    g.addColorStop(0, 'rgba(255,255,255,1)');
    g.addColorStop(0.35, 'rgba(255,255,255,0.6)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
    return new THREE.CanvasTexture(c);
}

// ===== Background: a flowing "data plane" of points plus drifting particles =====
function initBackground() {
    const canvas = document.getElementById('bg-canvas');
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true, powerPreference: 'low-power' });
    renderer.setPixelRatio(Math.min(pixelRatio, 1.5));
    renderer.setSize(window.innerWidth, window.innerHeight, false);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x06080c, 0.045);
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 3.2, 12);
    camera.lookAt(0, 0, 0);

    const dot = softDot();
    const lime = new THREE.Color(0x42ff1c);
    const cyan = new THREE.Color(0x40c9ff);

    // Wave grid
    const cols = isMobile ? 70 : 120, rows = isMobile ? 40 : 60;
    const spacing = 0.42;
    const gridPos = new Float32Array(cols * rows * 3);
    const gridCol = new Float32Array(cols * rows * 3);
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            const k = (i * rows + j) * 3;
            gridPos[k] = (i - cols / 2) * spacing;
            gridPos[k + 1] = 0;
            gridPos[k + 2] = (j - rows / 2) * spacing;
            const c = cyan.clone().lerp(lime, i / cols);
            gridCol[k] = c.r; gridCol[k + 1] = c.g; gridCol[k + 2] = c.b;
        }
    }
    const gridGeo = new THREE.BufferGeometry();
    gridGeo.setAttribute('position', new THREE.BufferAttribute(gridPos, 3));
    gridGeo.setAttribute('color', new THREE.BufferAttribute(gridCol, 3));
    const grid = new THREE.Points(gridGeo, new THREE.PointsMaterial({
        size: 0.07, map: dot, vertexColors: true, transparent: true, opacity: 0.55,
        depthWrite: false, blending: THREE.AdditiveBlending
    }));
    grid.position.y = -3;
    scene.add(grid);

    // Drifting particles
    const count = isMobile ? 260 : 600;
    const pPos = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
        pPos[i * 3] = (Math.random() - 0.5) * 40;
        pPos[i * 3 + 1] = Math.random() * 14 - 4;
        pPos[i * 3 + 2] = (Math.random() - 0.5) * 30;
        speeds[i] = 0.004 + Math.random() * 0.012;
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const particles = new THREE.Points(pGeo, new THREE.PointsMaterial({
        size: 0.09, map: dot, color: 0x9fe8ff, transparent: true, opacity: 0.5,
        depthWrite: false, blending: THREE.AdditiveBlending
    }));
    scene.add(particles);

    let scrollY = window.scrollY;
    window.addEventListener('scroll', () => { scrollY = window.scrollY; }, { passive: true });
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight, false);
    });

    const clock = new THREE.Clock();
    const render = () => {
        const t = clock.getElapsedTime();
        const pos = gridGeo.attributes.position.array;
        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                const k = (i * rows + j) * 3;
                const x = pos[k], z = pos[k + 2];
                pos[k + 1] = Math.sin(x * 0.35 + t * 0.8) * 0.45 + Math.cos(z * 0.45 + t * 0.6) * 0.35;
            }
        }
        gridGeo.attributes.position.needsUpdate = true;

        const pp = pGeo.attributes.position.array;
        for (let i = 0; i < count; i++) {
            pp[i * 3 + 1] += speeds[i];
            if (pp[i * 3 + 1] > 10) pp[i * 3 + 1] = -4;
        }
        pGeo.attributes.position.needsUpdate = true;

        const scrollFactor = scrollY / window.innerHeight;
        camera.position.x += (pointer.x * 1.2 - camera.position.x) * 0.03;
        camera.position.y += (3.2 - pointer.y * 0.6 + scrollFactor * 0.5 - camera.position.y) * 0.03;
        camera.lookAt(0, -scrollFactor * 0.4, 0);
        grid.rotation.y = scrollFactor * 0.12;

        renderer.render(scene, camera);
    };

    if (reduceMotion) {
        render();
        return;
    }
    renderer.setAnimationLoop(() => { if (!document.hidden) render(); });
}

// ===== Hero avatar (Ready Player Me GLB) =====
function initAvatar() {
    const stage = document.getElementById('avatar-stage');
    const canvas = document.getElementById('avatar-canvas');
    if (!stage || !canvas) return;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(pixelRatio);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(26, 1, 0.1, 50);
    camera.position.set(0, 1.5, 2.6);
    const target = new THREE.Vector3(0, 1.42, 0);
    camera.lookAt(target);

    scene.add(new THREE.HemisphereLight(0xcfe8ff, 0x0b1a10, 1.1));
    const key = new THREE.DirectionalLight(0xffffff, 1.6);
    key.position.set(1.5, 2.5, 3);
    scene.add(key);
    const rimLime = new THREE.DirectionalLight(0x42ff1c, 3.2);
    rimLime.position.set(-2.5, 1.8, -1.5);
    scene.add(rimLime);
    const rimCyan = new THREE.DirectionalLight(0x40c9ff, 3.6);
    rimCyan.position.set(2.5, 1.6, -1.8);
    scene.add(rimCyan);

    // Orbiting data rings
    const dot = softDot();
    const rings = new THREE.Group();
    [[0.62, 0x40c9ff, 180, 0.35], [0.78, 0x42ff1c, 220, -0.25]].forEach(([radius, color, n, tilt]) => {
        const pos = new Float32Array(n * 3);
        for (let i = 0; i < n; i++) {
            const a = (i / n) * Math.PI * 2;
            const jitter = (Math.random() - 0.5) * 0.04;
            pos[i * 3] = Math.cos(a) * (radius + jitter);
            pos[i * 3 + 1] = (Math.random() - 0.5) * 0.03;
            pos[i * 3 + 2] = Math.sin(a) * (radius + jitter);
        }
        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
        const ring = new THREE.Points(geo, new THREE.PointsMaterial({
            size: 0.028, map: dot, color, transparent: true, opacity: 0.9,
            depthWrite: false, blending: THREE.AdditiveBlending
        }));
        ring.rotation.x = tilt;
        ring.rotation.z = tilt * 0.6;
        rings.add(ring);
    });
    rings.position.y = 1.18;
    scene.add(rings);

    const pivot = new THREE.Group();
    scene.add(pivot);

    const bones = {};
    const base = {};
    let smileMeshes = [];
    let smile = 0, smileTarget = 0;
    let dragYaw = 0, dragging = false, dragStartX = 0, dragStartYaw = 0;

    stage.addEventListener('pointerenter', () => { smileTarget = 0.7; });
    stage.addEventListener('pointerleave', () => { smileTarget = 0; });
    canvas.addEventListener('pointerdown', e => {
        dragging = true;
        dragStartX = e.clientX;
        dragStartYaw = dragYaw;
        canvas.setPointerCapture(e.pointerId);
    });
    canvas.addEventListener('pointermove', e => {
        if (dragging) dragYaw = dragStartYaw + (e.clientX - dragStartX) * 0.01;
    });
    canvas.addEventListener('pointerup', () => { dragging = false; });

    const onAvatar = gltf => {
        const model = gltf.scene;
        model.traverse(obj => {
            if (obj.isBone) bones[obj.name] = obj;
            if (obj.isMesh) {
                obj.frustumCulled = false;
                if (obj.morphTargetDictionary && 'mouthSmile' in obj.morphTargetDictionary) smileMeshes.push(obj);
            }
        });

        // Bring the arms down from the T-pose: aim each bone at a world-space direction.
        model.updateMatrixWorld(true);
        const aim = (name, childName, dir) => {
            const bone = bones[name], child = bones[childName];
            if (!bone || !child) return;
            const from = child.getWorldPosition(new THREE.Vector3()).sub(bone.getWorldPosition(new THREE.Vector3())).normalize();
            const delta = new THREE.Quaternion().setFromUnitVectors(from, dir.clone().normalize());
            const parentQ = bone.parent.getWorldQuaternion(new THREE.Quaternion());
            const worldQ = bone.getWorldQuaternion(new THREE.Quaternion());
            bone.quaternion.copy(parentQ.invert().multiply(delta.multiply(worldQ)));
            bone.updateMatrixWorld(true);
        };
        aim('LeftArm', 'LeftForeArm', new THREE.Vector3(0.22, -1, -0.04));
        aim('RightArm', 'RightForeArm', new THREE.Vector3(-0.22, -1, -0.04));
        aim('LeftForeArm', 'LeftHand', new THREE.Vector3(0.06, -1, 0.28));
        aim('RightForeArm', 'RightHand', new THREE.Vector3(-0.06, -1, 0.28));

        ['Head', 'Neck', 'Spine', 'Spine1', 'Spine2', 'LeftEye', 'RightEye'].forEach(name => {
            if (bones[name]) base[name] = bones[name].quaternion.clone();
        });

        pivot.add(model);
        stage.classList.remove('no-webgl');
        stage.classList.add('loaded');
    };
    const onAvatarError = err => {
        report('Avatar 3D indisponível', err);
        stage.classList.add('no-webgl');
    };

    // The GLB ships base64-encoded in js/avatar-data.js: browsers refuse to fetch files under file://.
    if (window.__AVATAR_GLB) {
        const bytes = Uint8Array.from(atob(window.__AVATAR_GLB), c => c.charCodeAt(0));
        new GLTFLoader().parse(bytes.buffer, '', onAvatar, onAvatarError);
    } else {
        new GLTFLoader().load('img/659f472fd054fa34a8fc9713.glb', onAvatar, undefined, onAvatarError);
    }

    const resize = () => {
        const { clientWidth: w, clientHeight: h } = stage;
        if (!w || !h) return;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
    };
    new ResizeObserver(resize).observe(stage);
    resize();

    let visible = true;
    new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }).observe(stage);

    const euler = new THREE.Euler();
    const q = new THREE.Quaternion();
    const applyOffset = (name, x, y, z) => {
        if (!bones[name] || !base[name]) return;
        euler.set(x, y, z);
        bones[name].quaternion.copy(base[name]).multiply(q.setFromEuler(euler));
    };

    const look = { x: 0, y: 0 };
    const clock = new THREE.Clock();
    const render = () => {
        const t = clock.getElapsedTime();

        // Follow the pointer; when idle, glance around on its own.
        const idle = performance.now() - pointer.lastMove > 3500;
        const tx = idle ? Math.sin(t * 0.5) * 0.35 : pointer.x;
        const ty = idle ? Math.sin(t * 0.33) * 0.15 : pointer.y;
        look.x += (tx - look.x) * 0.06;
        look.y += (ty - look.y) * 0.06;

        const breath = Math.sin(t * 1.6);
        applyOffset('Spine', breath * 0.012, look.x * 0.08, 0);
        applyOffset('Spine2', breath * 0.018, look.x * 0.1, 0);
        applyOffset('Neck', look.y * 0.12, look.x * 0.25, 0);
        applyOffset('Head', look.y * 0.22, look.x * 0.45, -look.x * 0.05);
        applyOffset('LeftEye', look.y * 0.2, look.x * 0.3, 0);
        applyOffset('RightEye', look.y * 0.2, look.x * 0.3, 0);

        smile += (smileTarget - smile) * 0.08;
        for (const mesh of smileMeshes) mesh.morphTargetInfluences[mesh.morphTargetDictionary.mouthSmile] = smile;

        if (!dragging) dragYaw *= 0.94;
        pivot.rotation.y = dragYaw + Math.sin(t * 0.4) * 0.05;
        pivot.position.y = Math.sin(t * 1.1) * 0.012;

        rings.rotation.y = t * 0.25;
        rings.children[1].rotation.y = -t * 0.4;

        renderer.render(scene, camera);
    };

    if (reduceMotion) {
        renderer.setAnimationLoop(() => {
            render();
            if (stage.classList.contains('loaded')) renderer.setAnimationLoop(null);
        });
        return;
    }
    renderer.setAnimationLoop(() => { if (visible && !document.hidden) render(); });
}

const showFallback = () => document.getElementById('avatar-stage')?.classList.add('no-webgl');

if (webglAvailable()) {
    // Each scene fails independently: a broken background must not take the avatar down with it.
    try { initBackground(); } catch (err) { report('Fundo 3D indisponível', err); }
    try { initAvatar(); } catch (err) { report('Avatar 3D indisponível', err); showFallback(); }
} else {
    showFallback();
}
