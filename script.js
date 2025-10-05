// ===========================================
// script.js - Lógica Principal del Juego
// ===========================================

/**
 * Función principal de inicialización del juego.
 * Se llama cuando el contenido principal se muestra (después de las pantallas de inicio).
 */
function init() {
  // ---------------------------
  // 1. Datos del juego (eventos)
  // ---------------------------
  const events = [
    {
      year: 2025,
      context: "Un derrame en el Golfo de México afecta fauna y comunidades costeras.",
      warning: "El impacto podría durar décadas si no se actúa con rapidez.",
      options: [
        { text: "Ordenar limpieza inmediata, aunque sin un plan de largo plazo.", effect: +1 },
        { text: "Priorizar compensaciones económicas antes que restaurar el ecosistema.", effect: -1 },
        { text: "Suspender temporalmente toda actividad petrolera en la zona.", effect: +2 },
        { text: "Dejar que las empresas privadas gestionen el desastre con incentivos.", effect: -2 }
      ]
    },
    {
      year: 2026,
      context: "Europa enfrenta temperaturas superiores a 50 grados C y apagones.",
      warning: "Si no se rediseñan las ciudades, el sistema colapsará.",
      options: [
        { text: "Promover el teletrabajo.", effect: +1 },
        { text: "Usar aire acondicionado con energía renovable.", effect: 0 },
        { text: "Plantar bosques urbanos.", effect: +2 },
        { text: "Invertir solo en infraestructura climática para grandes ciudades.", effect: -1 }
      ]
    },
    {
      year: 2027,
      context: "La escasez de agua se agrava por sobreexplotación y contaminación.",
      warning: "Millones podrían quedar sin acceso al agua potable antes de 2030.",
      options: [
        { text: "Construir plantas desalinizadoras.", effect: +1 },
        { text: "Lanzar campañas sin restricciones.", effect: 0 },
        { text: "Subvencionar agua para industrias.", effect: -1 },
        { text: "Implementar racionamiento priorizando el consumo humano.", effect: +2 }
      ]
    },
    {
      year: 2028,
      context: "Niebla tóxica cubre ciudades por semanas.",
      warning: "La contaminación podría causar enfermedades irreversibles.",
      options: [
        { text: "Cerrar fábricas temporalmente.", effect: +2 },
        { text: "Instalar filtros en zonas urbanas.", effect: +1 },
        { text: "Trasladar industrias a zonas rurales.", effect: -1 },
        { text: "Aumentar producción industrial y prometer medidas futuras.", effect: -2 }
      ]
    },
    {
      year: 2029,
      context: "La Amazonía está al borde del colapso ecológico.",
      warning: "Si se transforma en sabana, el clima mundial perderá su principal regulador.",
      options: [
        { text: "Prohibir toda tala.", effect: +2 },
        { text: "Tala sostenible con monitoreo.", effect: +1 },
        { text: "Proyectos agrícolas en zonas deforestadas.", effect: 0 },
        { text: "Promover turismo ecológico masivo.", effect: -1 }
      ]
    },
    {
      year: 2030,
      context: "África sufre desertificación masiva y pérdida de suelos agrícolas.",
      warning: "La migración climática podría aumentar exponencialmente.",
      options: [
        { text: "Proyectos agrícolas tecnológicos.", effect: +1 },
        { text: "Combinar técnicas tradicionales y modernas.", effect: +2 },
        { text: "Incentivar migración hacia zonas fértiles.", effect: -1 },
        { text: "Crear reservas naturales prohibiendo el uso humano.", effect: 0 }
      ]
    },
    {
      year: 2031,
      context: "El 70 porciento de los arrecifes del Pacífico se blanquean por el calentamiento global.",
      warning: "La pérdida del coral afectará ecosistemas y comunidades costeras enteras.",
      options: [
        { text: "Establecer áreas de exclusión total de pesca.", effect: +2 },
        { text: "Financiar investigación en corales resistentes al calor.", effect: +1 },
        { text: "Impulsar turismo ecológico controlado.", effect: 0 },
        { text: "Permitir pesca regulada mientras se restaura el coral.", effect: -1 }
      ]
    },
    {
      year: 2032,
      context: "Crisis energética en Medio Oriente por caída en la demanda petrolera.",
      warning: "Sin diversificación, podría haber colapsos financieros y sociales.",
      options: [
        { text: "Invertir en energía solar con recortes en otros sectores.", effect: +2 },
        { text: "Ofrecer incentivos al uso doméstico de energía limpia.", effect: +1 },
        { text: "Mantener producción petrolera mientras se planea la transición.", effect: -1 },
        { text: "Importar energía limpia en lugar de producirla localmente.", effect: 0 }
      ]
    },
    {
      year: 2033,
      context: "El deshielo antártico alcanza niveles récord, sube el nivel del mar.",
      warning: "Millones podrían verse desplazados antes de 2050 si no se frena.",
      options: [
        { text: "Firmar tratado global urgente para reducir emisiones.", effect: +2 },
        { text: "Financiar investigaciones para frenar el deshielo.", effect: +1 },
        { text: "Construir barreras costeras en las ciudades más vulnerables.", effect: 0 },
        { text: "Priorizar el crecimiento económico sobre el medio ambiente.", effect: -2 }
      ]
    },
    {
      year: 2034,
      context: "El Ártico pierde casi todo su hielo estacional por primera vez.",
      warning: "Esto altera las corrientes oceánicas y el clima global.",
      options: [
        { text: "Prohibir explotación petrolera en zonas árticas.", effect: +2 },
        { text: "Invertir en tecnologías de enfriamiento atmosférico experimental.", effect: +1 },
        { text: "Permitir nuevas rutas comerciales polares.", effect: -1 },
        { text: "Autorizar extracción masiva de recursos aprovechando el deshielo.", effect: -2 }
      ]
    },
    {
      year: 2035,
      context: "El planeta alcanza su punto crítico. Eventos extremos son comunes.",
      warning: "Las decisiones de hoy definirán el futuro habitable.",
      options: [
        { text: "Firmar acuerdo mundial con sanciones reales.", effect: +2 },
        { text: "Incentivar innovación sin compromisos.", effect: +1 },
        { text: "Dejar que cada país actúe por su cuenta.", effect: 0 },
        { text: "Aumentar producción industrial para financiar soluciones futuras.", effect: -2 }
      ]
    }
  ];
  
  // ---------------------------
  // 2. Variables y Referencias DOM
  // ---------------------------
  let currentIndex = 0;
  let planetScore = 50;
  let nightTexture;
  
  const yearEl = document.getElementById("year");
  const contextEl = document.getElementById("context");
  const warningEl = document.getElementById("warning");
  const choicesEl = document.getElementById("choices");
  const nextBtn = document.getElementById("next");
  const scoreEl = document.getElementById("planetScore");
  const healthBarFillEl = document.getElementById("health-bar-fill");
  const finalEl = document.getElementById("final");
  const planetContainer = document.getElementById('planet-container');

  // ---------------------------
  // 3. Funciones de Puntuación y Barra de Vida
  // ---------------------------

  /** Actualiza el puntaje y la barra de vida en la UI. */
  function updateScore() {
    scoreEl.textContent = planetScore;
    updateHealthBar();
  }

  /** Modifica el color y el ancho de la barra de vida según el puntaje. */
  function updateHealthBar() {
    healthBarFillEl.style.width = `${planetScore}%`;
    
    // Limpia todas las clases de color antes de aplicar la nueva
    healthBarFillEl.className = ''; 

    if (planetScore >= 80) healthBarFillEl.classList.add("health-green");
    else if (planetScore >= 60) healthBarFillEl.classList.add("health-light-green");
    else if (planetScore >= 40) healthBarFillEl.classList.add("health-yellow");
    else if (planetScore >= 20) healthBarFillEl.classList.add("health-orange");
    else healthBarFillEl.classList.add("health-red");
  }

  updateScore(); // Llama al inicio para inicializar la barra de vida.

  // ---------------------------
  // 4. Lógica Principal del Juego
  // ---------------------------

  /** Muestra el evento actual y sus opciones en la UI. */
  function renderEvent() {
    const event = events[currentIndex];
    yearEl.textContent = `Ano ${event.year}`;
    contextEl.textContent = event.context;
    warningEl.textContent = event.warning;
    choicesEl.innerHTML = "";
    nextBtn.classList.add("hidden");
    finalEl.classList.add("hidden");

    event.options.forEach((opt, i) => {
      const btn = document.createElement("div");
      btn.className = "choice";
      // Añade letra de opción (a, b, c, d)
      btn.textContent = `${String.fromCharCode(97 + i)}) ${opt.text}`; 
      btn.dataset.effect = opt.effect;
      
      btn.addEventListener("click", handleChoiceClick);
      choicesEl.appendChild(btn);
    });
  }

  /** Maneja la selección de una opción. */
  function handleChoiceClick(e) {
    const btn = e.currentTarget;
    const effect = Number(btn.dataset.effect) * 5;
    
    // Calcula el nuevo puntaje, asegurando que se mantenga entre 0 y 100
    planetScore = Math.max(0, Math.min(100, planetScore + effect));
    updateScore();

    // Deshabilita todas las opciones y resalta la elegida
    Array.from(choicesEl.children).forEach(c => c.classList.add("disabled"));
    btn.classList.remove("disabled");
    btn.classList.add("selected");

    nextBtn.classList.remove("hidden");
  }

  /** Maneja el clic en el botón "Siguiente Ano". */
  nextBtn.addEventListener("click", () => {
    currentIndex++;
    if (currentIndex < events.length) renderEvent();
    else endGame();
  });

  /** Finaliza el juego y muestra el mensaje final. */
  function endGame() {
    nextBtn.classList.add("hidden");
    yearEl.textContent = "Fin de la Simulación";
    contextEl.textContent = "";
    warningEl.textContent = "";

    let message = "";
    if (planetScore >= 80) message = "El planeta prospera. La humanidad actuó a tiempo.";
    else if (planetScore >= 50) message = "El planeta sobrevive con dificultad, pero aun hay esperanza.";
    else message = "El planeta colapsó. Las decisiones fueron insuficientes.";

    finalEl.textContent = message;
    finalEl.classList.remove("hidden");
    choicesEl.innerHTML = "";
  }
  
  renderEvent(); // Inicia el primer evento del juego

  // ===========================================
  // 5. THREE.JS: Inicialización y Animación
  // ===========================================

  // Se asume que THREE está disponible globalmente
  const canvas = document.getElementById("earthCanvas");
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  
  let earth; // Variable para la esfera de la Tierra

  /** Ajusta el tamaño del renderizador y la cámara al contenedor. */
  function resizeRenderer() {
    const rect = canvas.parentElement.getBoundingClientRect();
    const w = Math.max(300, Math.floor(rect.width));
    const h = Math.max(200, Math.floor(rect.height));
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }

  window.addEventListener('resize', resizeRenderer);

  // Luces
  const amb = new THREE.AmbientLight(0xffffff, 0.35); // Luz ambiental
  scene.add(amb);
  const dir = new THREE.DirectionalLight(0xffffff, 0.9); // Luz direccional (Sol)
  dir.position.set(5, 3, 5);
  scene.add(dir);

  /** Crea y configura el modelo 3D de la Tierra. */
  function createEarth() {
      const sphereGeo = new THREE.SphereGeometry(2, 64, 64);
      const placeholderMat = new THREE.MeshStandardMaterial({ color: 0x003366 });
      earth = new THREE.Mesh(sphereGeo, placeholderMat);
      scene.add(earth);
      camera.position.z = 6;
      resizeRenderer(); // Asegurar el tamaño inicial
  }

  /** Carga texturas para el día y la noche. */
  function loadTextures() {
      const loader = new THREE.TextureLoader();
      
      // Textura del Día
      loader.load(
          'assets/earth_texture.jpg',
          (texture) => {
              earth.material.map = texture;
              earth.material.color.setHex(0xffffff);
              earth.material.needsUpdate = true;
          },
          undefined,
          () => console.warn('No se pudo cargar la textura del día. Usando color sólido.')
      );

      // Textura Nocturna (Luces de la Ciudad)
      loader.load(
          'assets/night_lights.jpg', 
          (texture) => {
              nightTexture = texture;
              nightTexture.encoding = THREE.sRGBEncoding;
              nightTexture.flipY = true;

              earth.material.emissiveMap = nightTexture;
              earth.material.emissive = new THREE.Color(0xffffff);
              earth.material.emissiveIntensity = 0;
              earth.material.needsUpdate = true;
          },
          undefined,
          (err) => console.warn('No se pudo cargar la textura nocturna.', err)
      );
  }

  createEarth();
  loadTextures();

  // ---------------------------
  // 6. Lógica de Día / Noche
  // ---------------------------
  
  let dayProgress = 1; // 1 = Día, 0 = Noche
  const dayNightDuration = 60 * 1000; // 60 segundos por ciclo completo
  let lastTime = Date.now();
  let dayToNight = true; // Indica si estamos yendo de día a noche

  /** Lógica para transicionar suavemente entre el modo Día y Noche. */
  function updateDayNight() {
    const now = Date.now();
    const delta = now - lastTime;
    lastTime = now;

    const step = delta / dayNightDuration;
    // Incrementa o decrementa el progreso
    dayProgress += dayToNight ? -step : step;

    // Cambia la dirección al llegar a los límites
    if (dayProgress <= 0) { dayProgress = 0; dayToNight = false; }
    else if (dayProgress >= 1) { dayProgress = 1; dayToNight = true; }

    // Interpola el color del fondo (CSS)
    const p = dayProgress;
    
    // Colores usados en el background CSS
    const colorDayTop = { r: 77, g: 184, b: 255 };
    const colorDayBottom = { r: 0, g: 51, b: 77 };
    const colorNightTop = { r: 0, g: 17, b: 31 };
    const colorNightBottom = { r: 0, g: 0, b: 0 };

    function lerp(c1, c2, t) { return Math.round(c1 + (c2 - c1) * (1 - t)); }

    const topR = lerp(colorNightTop.r, colorDayTop.r, p);
    const topG = lerp(colorNightTop.g, colorDayTop.g, p);
    const topB = lerp(colorNightTop.b, colorDayTop.b, p);
    
    const bottomR = lerp(colorNightBottom.r, colorDayBottom.r, p);
    const bottomG = lerp(colorNightBottom.g, colorDayBottom.g, p);
    const bottomB = lerp(colorNightBottom.b, colorDayBottom.b, p);

    const toHex = (c) => c.toString(16).padStart(2, '0');
    const hexTop = `${toHex(topR)}${toHex(topG)}${toHex(topB)}`;
    const hexBottom = `${toHex(bottomR)}${toHex(bottomG)}${toHex(bottomB)}`;

    planetContainer.style.background = `radial-gradient(circle at top, #${hexTop} 0%, #${hexBottom} 60%)`;
    
    // Interpola la intensidad de las luces (Three.js)
    amb.intensity = 0.05 + 0.3 * p;
    dir.intensity = 0.2 + 0.7 * p;

    // Controla la intensidad de las luces de la ciudad
    if (nightTexture) {
      earth.material.emissiveIntensity = (1 - p) * 5; // Más fuerte en la noche (p=0)
    }
  }
  
  // ---------------------------
  // 7. Loop de Animación
  // ---------------------------

  /** Loop principal de renderizado y animación. */
  function animate() {
    requestAnimationFrame(animate);
    
    // Rotación constante de la Tierra
    earth.rotation.y += 0.0018; 
    
    // Pequeña oscilación para dar dinamismo
    earth.rotation.x = 0.02 * Math.sin(Date.now() * 0.0005); 

    updateDayNight(); // Actualiza la transición día/noche
    renderer.render(scene, camera);
  }

  animate(); // Inicia el loop de animación
}