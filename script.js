import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.155.0/build/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.155.0/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.155.0/examples/jsm/controls/OrbitControls.js';

// ========================================
// CONFIGURACIÓN INICIAL DE LA ESCENA
// ========================================

const escena = new THREE.Scene();
const camara = new THREE.PerspectiveCamera(
  75, 
  window.innerWidth / window.innerHeight, 
  0.1, 
  2000
);

const renderizador = new THREE.WebGLRenderer({ 
  antialias: true,
  alpha: true 
});

renderizador.setSize(window.innerWidth, window.innerHeight);
renderizador.setPixelRatio(window.devicePixelRatio);
renderizador.shadowMap.enabled = true;
renderizador.shadowMap.type = THREE.PCFSoftShadowMap;
renderizador.outputEncoding = THREE.sRGBEncoding;
renderizador.toneMapping = THREE.ACESFilmicToneMapping;
renderizador.toneMappingExposure = 1.2;

document.body.appendChild(renderizador.domElement);

// ========================================
// ILUMINACIÓN MEJORADA
// ========================================

// Luz ambiental suave
const luzAmbiental = new THREE.AmbientLight(0xffffff, 0.6);
escena.add(luzAmbiental);

// Luz direccional principal (sol)
const luzSol = new THREE.DirectionalLight(0xfff4e6, 1.5);
luzSol.position.set(50, 100, 50);
luzSol.castShadow = true;

// Configuración de sombras
luzSol.shadow.camera.left = -100;
luzSol.shadow.camera.right = 100;
luzSol.shadow.camera.top = 100;
luzSol.shadow.camera.bottom = -100;
luzSol.shadow.camera.near = 0.5;
luzSol.shadow.camera.far = 500;
luzSol.shadow.mapSize.width = 2048;
luzSol.shadow.mapSize.height = 2048;
luzSol.shadow.bias = -0.0001;

escena.add(luzSol);

// Luz de relleno
const luzRelleno = new THREE.DirectionalLight(0xadd8e6, 0.4);
luzRelleno.position.set(-30, 50, -30);
escena.add(luzRelleno);

// Luz hemisférica para ambiente natural
const luzHemisferica = new THREE.HemisphereLight(0x87ceeb, 0x2d5016, 0.5);
escena.add(luzHemisferica);

// ========================================
// FONDO Y ATMÓSFERA
// ========================================

escena.background = new THREE.Color(0x87ceeb);
escena.fog = new THREE.Fog(0x87ceeb, 100, 600);

// ========================================
// SUELO (PASTO)
// ========================================

const suelo = new THREE.Mesh(
  new THREE.PlaneGeometry(500, 500, 50, 50),
  new THREE.MeshStandardMaterial({ 
    color: 0x3a6b35,
    roughness: 0.9,
    metalness: 0.1
  })
);
suelo.rotation.x = -Math.PI / 2;
suelo.receiveShadow = true;
escena.add(suelo);

// Añadir variación al terreno
const posiciones = suelo.geometry.attributes.position;
for (let i = 0; i < posiciones.count; i++) {
  const y = Math.random() * 0.5;
  posiciones.setY(i, y);
}
posiciones.needsUpdate = true;
suelo.geometry.computeVertexNormals();

// ========================================
// CREAR PRINCESA (mientras carga el castillo)
// ========================================

function crearPrincesa() {
  const princesa = new THREE.Group();

  // Vestido
  const vestidoGeom = new THREE.CylinderGeometry(1.5, 3.5, 7, 16);
  const vestidoMat = new THREE.MeshStandardMaterial({ 
    color: 0xff69b4,
    roughness: 0.5,
    metalness: 0.2
  });
  const vestido = new THREE.Mesh(vestidoGeom, vestidoMat);
  vestido.castShadow = true;
  princesa.add(vestido);

  // Cabeza
  const cabezaGeom = new THREE.SphereGeometry(1.2, 16, 16);
  const cabezaMat = new THREE.MeshStandardMaterial({ 
    color: 0xffdab9,
    roughness: 0.6
  });
  const cabeza = new THREE.Mesh(cabezaGeom, cabezaMat);
  cabeza.position.y = 4.5;
  cabeza.castShadow = true;
  princesa.add(cabeza);

  // Corona
  const coronaGeom = new THREE.ConeGeometry(1, 1.5, 6);
  const coronaMat = new THREE.MeshStandardMaterial({ 
    color: 0xffd700,
    metalness: 0.8,
    roughness: 0.2
  });
  const corona = new THREE.Mesh(coronaGeom, coronaMat);
  corona.position.y = 6;
  princesa.add(corona);

  // Ojos
  const ojoGeom = new THREE.SphereGeometry(0.15, 8, 8);
  const ojoMat = new THREE.MeshStandardMaterial({ color: 0x000000 });
  
  const ojoIzq = new THREE.Mesh(ojoGeom, ojoMat);
  ojoIzq.position.set(-0.4, 4.7, 1);
  princesa.add(ojoIzq);
  
  const ojoDer = new THREE.Mesh(ojoGeom, ojoMat);
  objoDer.position.set(0.4, 4.7, 1);
  princesa.add(ojoDer);

  princesa.position.set(-25, 3.5, 15);
  return princesa;
}

const princesa = crearPrincesa();
escena.add(princesa);

// ========================================
// ÁRBOLES DECORATIVOS
// ========================================

function crearArbol(x, z, escala = 1) {
  const arbol = new THREE.Group();

  const troncoGeom = new THREE.CylinderGeometry(0.4 * escala, 0.6 * escala, 6 * escala);
  const troncoMat = new THREE.MeshStandardMaterial({ color: 0x654321 });
  const tronco = new THREE.Mesh(troncoGeom, troncoMat);
  tronco.castShadow = true;
  arbol.add(tronco);

  const copasGeom = new THREE.SphereGeometry(2.5 * escala, 12, 12);
  const copasMat = new THREE.MeshStandardMaterial({ 
    color: 0x228b22,
    roughness: 0.8
  });
  const copas = new THREE.Mesh(copasGeom, copasMat);
  copas.position.y = 5 * escala;
  copas.castShadow = true;
  arbol.add(copas);

  arbol.position.set(x, 3 * escala, z);
  return arbol;
}

// Distribuir árboles
const posicionesArboles = [
  [-60, -40, 1.2], [60, -40, 1], [-60, 50, 1.3], [70, 45, 0.9],
  [-80, 0, 1.1], [80, 10, 1.2], [-30, -60, 1], [40, 60, 1.1],
  [-45, 30, 0.8], [50, -20, 1.3], [-70, 20, 1], [35, -45, 0.9]
];

posicionesArboles.forEach(([x, z, escala]) => {
  escena.add(crearArbol(x, z, escala));
});

// ========================================
// PARTÍCULAS MÁGICAS
// ========================================

const particulasGeom = new THREE.BufferGeometry();
const particulasCount = 800;
const posiciones = new Float32Array(particulasCount * 3);

for (let i = 0; i < particulasCount; i++) {
  posiciones[i * 3] = (Math.random() - 0.5) * 200;
  posiciones[i * 3 + 1] = Math.random() * 50 + 5;
  posiciones[i * 3 + 2] = (Math.random() - 0.5) * 200;
}

particulasGeom.setAttribute('position', new THREE.BufferAttribute(posiciones, 3));

const particulasMat = new THREE.PointsMaterial({ 
  color: 0xffd700, 
  size: 0.6,
  transparent: true,
  opacity: 0.7,
  blending: THREE.AdditiveBlending,
  depthWrite: false
});

const particulas = new THREE.Points(particulasGeom, particulasMat);
escena.add(particulas);

// ========================================
// CARGAR MODELO 3D DEL CASTILLO
// ========================================

const loader = new GLTFLoader();
let castilloModelo = null;

loader.load(
  './modelos/castillo.glb', // Asegúrate de que la ruta sea correcta
  
  // Función cuando carga exitosamente
  function (gltf) {
    castilloModelo = gltf.scene;

    // Configurar el castillo
    castilloModelo.scale.set(5, 5, 5); // Ajusta según el tamaño de tu modelo
    castilloModelo.position.set(0, 0, 0);
    castilloModelo.rotation.y = Math.PI; // Rotar si está de espaldas

    // Habilitar sombras en todos los meshes del modelo
    castilloModelo.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        
        // Mejorar materiales
        if (child.material) {
          child.material.needsUpdate = true;
        }
      }
    });

    escena.add(castilloModelo);

    // Ocultar mensaje de carga
    document.getElementById('cargando').style.display = 'none';

    console.log('✅ Castillo cargado exitosamente!');
    console.log('Posición:', castilloModelo.position);
    console.log('Escala:', castilloModelo.scale);
  },
  
  // Función de progreso
  function (xhr) {
    const porcentaje = (xhr.loaded / xhr.total * 100).toFixed(0);
    console.log(`Cargando: ${porcentaje}%`);
    
    const elementoProgreso = document.getElementById('progreso');
    if (elementoProgreso) {
      elementoProgreso.textContent = `${porcentaje}%`;
    }
  },
  
  // Función de error
  function (error) {
    console.error('❌ Error al cargar el castillo:', error);
    
    const elementoCargando = document.getElementById('cargando');
    if (elementoCargando) {
      elementoCargando.innerHTML = `
        <p style="color: #ff6b6b;">⚠️ No se pudo cargar el castillo</p>
        <p style="font-size: 0.9rem; margin-top: 10px;">
          Verifica que el archivo esté en: <strong>./modelos/castillo.glb</strong>
        </p>
        <p style="font-size: 0.85rem; color: #ffd700; margin-top: 10px;">
          Consejo: Usa un servidor local (Live Server, Python HTTP, etc.)
        </p>
      `;
    }
  }
);

// ========================================
// CONTROLES DE CÁMARA
// ========================================

camara.position.set(40, 30, 60);
camara.lookAt(0, 10, 0);

const controles = new OrbitControls(camara, renderizador.domElement);
controles.enableDamping = true;
controles.dampingFactor = 0.05;
controles.minDistance = 20;
controles.maxDistance = 150;
controles.maxPolarAngle = Math.PI / 2 - 0.1;
controles.target.set(0, 10, 0);

// ========================================
// LOOP DE ANIMACIÓN
// ========================================

let tiempo = 0;

function animar() {
  requestAnimationFrame(animar);
  tiempo += 0.01;

  // Animar princesa (movimiento circular suave)
  princesa.position.x = -25 + Math.cos(tiempo * 0.2) * 12;
  princesa.position.z = 15 + Math.sin(tiempo * 0.2) * 12;
  princesa.rotation.y = -tiempo * 0.2 + Math.PI / 2;

  // Animar partículas
  particulas.rotation.y += 0.0005;
  const posArray = particulas.geometry.attributes.position.array;
  
  for (let i = 0; i < posArray.length; i += 3) {
    posArray[i + 1] += Math.sin(tiempo * 2 + i) * 0.01;
    
    // Reiniciar partículas que caen
    if (posArray[i + 1] > 60) {
      posArray[i + 1] = 5;
    }
    if (posArray[i + 1] < 5) {
      posArray[i + 1] = 60;
    }
  }
  particulas.geometry.attributes.position.needsUpdate = true;

  // Animar castillo si está cargado
  if (castilloModelo) {
    castilloModelo.rotation.y += 0.0002; // Rotación muy sutil
  }

  controles.update();
  renderizador.render(escena, camara);
}

animar();

// ========================================
// AJUSTE DE VENTANA
// ========================================

window.addEventListener('resize', () => {
  camara.aspect = window.innerWidth / window.innerHeight;
  camara.updateProjectionMatrix();
  renderizador.setSize(window.innerWidth, window.innerHeight);
  renderizador.setPixelRatio(window.devicePixelRatio);
});

// ========================================
// INFORMACIÓN DE DEBUG (F12 para ver)
// ========================================

console.log('🏰 Reino Encantado Iniciado');
console.log('📁 Buscando modelo en: ./modelos/castillo.glb');
console.log('💡 Asegúrate de usar un servidor local para que funcione');