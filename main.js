const canvas = document.getElementById('holoCanvas');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setScissorTest(true);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

// Iluminação para os modelos 3D
const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
scene.add(ambientLight);

const pointLight1 = new THREE.PointLight(0xD67127, 1.5, 20);
pointLight1.position.set(3, 4, 4);
scene.add(pointLight1);

const pointLight2 = new THREE.PointLight(0x3B6E8C, 1.5, 20);
pointLight2.position.set(-3, -2, 4);
scene.add(pointLight2);

// Grupo principal que gira no centro
const holoGroup = new THREE.Group();
scene.add(holoGroup);

// Partículas tech flutuando ao redor (cores Ctrl+Play: azul, laranja e verde)
const particleCount = 120;
const particleGeo = new THREE.BufferGeometry();
const particlePositions = new Float32Array(particleCount * 3);
const particleColors = new Float32Array(particleCount * 3);
const palette = [
  new THREE.Color(0xD67127), // Laranja Ctrl+Play
  new THREE.Color(0x3B6E8C), // Azul Ctrl+Play
  new THREE.Color(0x45B649)  // Verde Mascote
];

for (let i = 0; i < particleCount; i++) {
  const radius = 1.4 + Math.random() * 1.2;
  const theta = Math.random() * Math.PI * 2;
  const y = (Math.random() - 0.5) * 2.4;
  particlePositions[i * 3] = Math.cos(theta) * radius;
  particlePositions[i * 3 + 1] = y;
  particlePositions[i * 3 + 2] = Math.sin(theta) * radius;

  const col = palette[i % palette.length];
  particleColors[i * 3] = col.r;
  particleColors[i * 3 + 1] = col.g;
  particleColors[i * 3 + 2] = col.b;
}

particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));
const particleMat = new THREE.PointsMaterial({ size: 0.05, vertexColors: true });
const particles = new THREE.Points(particleGeo, particleMat);
scene.add(particles);

// Função auxiliar: carrega imagem e remove fundo branco/cinza automaticamente se não for PNG transparente
function loadCleanTexture(url, callback) {
  const img = new Image();
  img.crossOrigin = 'Anonymous';
  img.onload = () => {
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = img.width;
    tempCanvas.height = img.height;
    const ctx = tempCanvas.getContext('2d');
    ctx.drawImage(img, 0, 0);

    const imgData = ctx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
    const data = imgData.data;

    // Torna pixels quase brancos/cinza-claros do fundo transparentes
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i], g = data[i + 1], b = data[i + 2];
      const isNeutralLight = Math.abs(r - g) < 18 && Math.abs(g - b) < 18 && r > 185;
      if (isNeutralLight) {
        data[i + 3] = 0;
      }
    }
    ctx.putImageData(imgData, 0, 0);

    const texture = new THREE.CanvasTexture(tempCanvas);
    callback(texture, img.width / img.height);
  };
  img.src = url;
}

// --- MODOS DO HOLOGRAMA ---
let currentMode = 1;
const objects = {};

// MODO 1: Mascote Ctrl+Play flutuando com anéis holográficos
objects[1] = new THREE.Group();
loadCleanTexture('assets/mascote.png', (tex, aspect) => {
  const geo = new THREE.PlaneGeometry(2.1 * aspect, 2.1);
  const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, side: THREE.DoubleSide });
  const mesh = new THREE.Mesh(geo, mat);
  objects[1].add(mesh);
});
const ring1 = new THREE.Mesh(
  new THREE.RingGeometry(1.15, 1.2, 48),
  new THREE.MeshBasicMaterial({ color: 0x45B649, side: THREE.DoubleSide })
);
ring1.rotation.x = Math.PI / 2;
ring1.position.y = -1.1;
objects[1].add(ring1);

// MODO 2: Logo Ctrl+Play com moldura neon 3D
objects[2] = new THREE.Group();
loadCleanTexture('assets/logo.png', (tex, aspect) => {
  const geo = new THREE.PlaneGeometry(2.2 * aspect, 2.2);
  const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, side: THREE.DoubleSide });
  const mesh = new THREE.Mesh(geo, mat);
  objects[2].add(mesh);
});
const frameGeo = new THREE.TorusGeometry(1.35, 0.025, 16, 4);
const frameMat = new THREE.MeshBasicMaterial({ color: 0xD67127 });
const frameMesh = new THREE.Mesh(frameGeo, frameMat);
frameMesh.rotation.z = Math.PI / 4;
objects[2].add(frameMesh);

// MODO 3: Foguete 3D inspirado na logo Ctrl+Play
objects[3] = new THREE.Group();
const bodyMat = new THREE.MeshStandardMaterial({ color: 0x3B6E8C, metalness: 0.4, roughness: 0.3 });
const accentMat = new THREE.MeshStandardMaterial({ color: 0xD67127, emissive: 0xD67127, emissiveIntensity: 0.5 });

const rocketBody = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.35, 1.1, 24), bodyMat);
const rocketNose = new THREE.Mesh(new THREE.ConeGeometry(0.25, 0.5, 24), accentMat);
rocketNose.position.y = 0.8;

const windowRing = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.03, 12, 24), accentMat);
windowRing.position.set(0, 0.25, 0.28);

const flame = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.55, 16), accentMat);
flame.rotation.x = Math.PI;
flame.position.y = -0.82;
flame.name = 'flame';

objects[3].add(rocketBody, rocketNose, windowRing, flame);
for (let i = 0; i < 3; i++) {
  const fin = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.4, 0.35), bodyMat);
  const angle = (i * Math.PI * 2) / 3;
  fin.position.set(Math.cos(angle) * 0.35, -0.35, Math.sin(angle) * 0.35);
  fin.rotation.y = -angle;
  objects[3].add(fin);
}

// MODO 4: Núcleo de Robótica & Código (Wireframe + Esfera)
objects[4] = new THREE.Group();
const core = new THREE.Mesh(
  new THREE.IcosahedronGeometry(0.65, 1),
  new THREE.MeshStandardMaterial({ color: 0xD67127, wireframe: true })
);
const outerShell = new THREE.Mesh(
  new THREE.OctahedronGeometry(1.05, 0),
  new THREE.MeshBasicMaterial({ color: 0x3B6E8C, wireframe: true })
);
objects[4].add(core, outerShell);

function setMode(mode) {
  currentMode = mode;
  while (holoGroup.children.length > 0) {
    holoGroup.remove(holoGroup.children[0]);
  }
  if (objects[mode]) {
    holoGroup.add(objects[mode]);
  }
}
setMode(1);

// --- CALIBRAÇÃO PARA O MONITOR FÍSICO ---
let viewOffset = 0.26; // Distância das projeções em relação ao centro da tela
let holoScale = 1.0;

window.addEventListener('keydown', (e) => {
  const key = e.key.toLowerCase();
  if (['1', '2', '3', '4'].includes(key)) setMode(Number(key));
  if (key === '+' || key === '=') viewOffset = Math.min(0.36, viewOffset + 0.01);
  if (key === '-' || key === '_') viewOffset = Math.max(0.14, viewOffset - 0.01);
  if (key === 's') {
    holoScale = holoScale >= 1.4 ? 0.7 : +(holoScale + 0.15).toFixed(2);
    holoGroup.scale.set(holoScale, holoScale, holoScale);
  }
  if (key === 'm') document.getElementById('centerGuide').classList.toggle('hidden');
  if (key === 'h') document.getElementById('hud').classList.toggle('hidden');
  if (key === 'f') {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen();
    else document.exitFullscreen();
  }
});

// Câmeras para as 4 faces da pirâmide
const camBottom = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
camBottom.position.set(0, 0, 4.5);

const camTop = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
camTop.position.set(0, 0, 4.5);
camTop.up.set(0, -1, 0); // Invertida para o lado superior
camTop.lookAt(0, 0, 0);

const camLeft = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
camLeft.position.set(0, 0, 4.5);
camLeft.up.set(1, 0, 0); // Rotacionada -90°
camLeft.lookAt(0, 0, 0);

const camRight = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
camRight.position.set(0, 0, 4.5);
camRight.up.set(-1, 0, 0); // Rotacionada +90°
camRight.lookAt(0, 0, 0);

function renderViewport(cam, centerX, centerY, size) {
  const left = Math.floor(centerX - size / 2);
  const bottom = Math.floor(centerY - size / 2);
  renderer.setViewport(left, bottom, size, size);
  renderer.setScissor(left, bottom, size, size);
  renderer.render(scene, cam);
}

// Loop de animação
const clock = new THREE.Clock();
function animate() {
  requestAnimationFrame(animate);
  const t = clock.getElapsedTime();

  // Animação suave de flutuação e giro
  holoGroup.rotation.y = Math.sin(t * 1.2) * 0.65;
  if (currentMode === 3 || currentMode === 4) {
    holoGroup.rotation.y = t * 1.1;
  }
  holoGroup.position.y = Math.sin(t * 2.2) * 0.08;
  particles.rotation.y = -t * 0.35;

  // Pulso da chama do foguete no modo 3
  const flameObj = objects[3].getObjectByName('flame');
  if (flameObj) {
    flameObj.scale.y = 0.85 + Math.sin(t * 20) * 0.2;
  }

  const w = window.innerWidth;
  const h = window.innerHeight;
  const minDim = Math.min(w, h);
  const vpSize = minDim * 0.34;
  const dist = minDim * viewOffset;

  // Renderiza as 4 direções ao redor do centro da tela
  renderViewport(camBottom, w / 2, h / 2 - dist, vpSize); // Base
  renderViewport(camTop,    w / 2, h / 2 + dist, vpSize); // Topo
  renderViewport(camLeft,   w / 2 - dist, h / 2, vpSize); // Esquerda
  renderViewport(camRight,  w / 2 + dist, h / 2, vpSize); // Direita
}

window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();