// ===========================================
// script.js - Main Game Logic
// ===========================================

/**
 * Main initialization function for the game.
 * Called when the main game content is displayed (after the splash screens).
 */
function init() {
  // ---------------------------
  // 1. Game Data (Events)
  // ---------------------------
  const events = [
    {
      year: 2025,
      context: "An oil spill in the Gulf of Mexico affects fauna and coastal communities.",
      warning: "The impact could last decades without swift action.",
      options: [
        { text: "Order immediate cleanup, even without a long-term plan.", effect: +1 },
        { text: "Prioritize financial compensation over ecosystem restoration.", effect: -1 },
        { text: "Temporarily suspend all oil activity in the area.", effect: +2 },
        { text: "Let private companies manage the disaster with incentives.", effect: -2 }
      ]
    },
    {
      year: 2026,
      context: "Europe faces temperatures over 50 degrees C and power outages.",
      warning: "If cities aren't redesigned, the system will collapse.",
      options: [
        { text: "Promote telecommuting.", effect: +1 },
        { text: "Use renewable energy for air conditioning.", effect: 0 },
        { text: "Plant urban forests.", effect: +2 },
        { text: "Invest only in climate infrastructure for large cities.", effect: -1 }
      ]
    },
    {
      year: 2027,
      context: "Water scarcity worsens due to over-exploitation and contamination.",
      warning: "Millions could lose access to drinking water before 2030.",
      options: [
        { text: "Build desalination plants.", effect: +1 },
        { text: "Launch campaigns without restrictions.", effect: 0 },
        { text: "Subsidize water for industries.", effect: -1 },
        { text: "Implement rationing, prioritizing human consumption.", effect: +2 }
      ]
    },
    {
      year: 2028,
      context: "Toxic smog covers cities for weeks.",
      warning: "Contamination could cause irreversible diseases.",
      options: [
        { text: "Temporarily close factories.", effect: +2 },
        { text: "Install filters in urban areas.", effect: +1 },
        { text: "Move industries to rural zones.", effect: -1 },
        { text: "Increase industrial production and promise future measures.", effect: -2 }
      ]
    },
    {
      year: 2029,
      context: "The Amazon is on the verge of ecological collapse.",
      warning: "If it turns into savanna, the global climate loses its main regulator.",
      options: [
        { text: "Prohibit all logging.", effect: +2 },
        { text: "Sustainable logging with monitoring.", effect: +1 },
        { text: "Agricultural projects in deforested areas.", effect: 0 },
        { text: "Promote massive eco-tourism.", effect: -1 }
      ]
    },
    {
      year: 2030,
      context: "Africa suffers massive desertification and loss of agricultural land.",
      warning: "Climate migration could increase exponentially.",
      options: [
        { text: "Technological agricultural projects.", effect: +1 },
        { text: "Combine traditional and modern techniques.", effect: +2 },
        { text: "Incentivize migration to fertile areas.", effect: -1 },
        { text: "Create nature reserves prohibiting human use.", effect: 0 }
      ]
    },
    {
      year: 2031,
      context: "70 percent of Pacific reefs are bleaching due to global warming.",
      warning: "Coral loss will affect entire ecosystems and coastal communities.",
      options: [
        { text: "Establish total exclusion zones for fishing.", effect: +2 },
        { text: "Fund research on heat-resistant corals.", effect: +1 },
        { text: "Promote controlled eco-tourism.", effect: 0 },
        { text: "Allow regulated fishing while coral restoration is planned.", effect: -1 }
      ]
    },
    {
      year: 2032,
      context: "Energy crisis in the Middle East due to falling oil demand.",
      warning: "Without diversification, financial and social collapse could occur.",
      options: [
        { text: "Invest in solar energy with cuts in other sectors.", effect: +2 },
        { text: "Offer incentives for domestic use of clean energy.", effect: +1 },
        { text: "Maintain oil production while planning the transition.", effect: -1 },
        { text: "Import clean energy instead of producing it locally.", effect: 0 }
      ]
    },
    {
      year: 2033,
      context: "Antarctic melting reaches record levels, sea level rises.",
      warning: "Millions could be displaced before 2050 if not stopped.",
      options: [
        { text: "Sign urgent global treaty to reduce emissions.", effect: +2 },
        { text: "Fund research to stop the melting.", effect: +1 },
        { text: "Build coastal barriers in the most vulnerable cities.", effect: 0 },
        { text: "Prioritize economic growth over the environment.", effect: -2 }
      ]
    },
    {
      year: 2034,
      context: "The Arctic loses almost all its seasonal ice for the first time.",
      warning: "This alters ocean currents and the global climate.",
      options: [
        { text: "Prohibit oil exploitation in Arctic zones.", effect: +2 },
        { text: "Invest in experimental atmospheric cooling technologies.", effect: +1 },
        { text: "Allow new polar commercial routes.", effect: -1 },
        { text: "Authorize massive resource extraction leveraging the melting.", effect: -2 }
      ]
    },
    {
      year: 2035,
      context: "The planet reaches its critical point. Extreme events are common.",
      warning: "Today's decisions will define a habitable future.",
      options: [
        { text: "Sign world agreement with real sanctions.", effect: +2 },
        { text: "Incentivize innovation without rigid commitments.", effect: +1 },
        { text: "Let each country act on its own.", effect: 0 },
        { text: "Increase industrial production to fund future solutions.", effect: -2 }
      ]
    }
  ];
  
  // ---------------------------
  // 2. Variables and DOM References
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
  // 3. Score and Health Bar Functions
  // ---------------------------

  /** Updates the score and health bar in the UI. */
  function updateScore() {
    scoreEl.textContent = planetScore;
    updateHealthBar();
  }

  /** Modifies the health bar's color and width based on the score. */
  function updateHealthBar() {
    healthBarFillEl.style.width = `${planetScore}%`;
    
    // Clear all color classes before applying the new one
    healthBarFillEl.className = ''; 

    if (planetScore >= 80) healthBarFillEl.classList.add("health-green");
    else if (planetScore >= 60) healthBarFillEl.classList.add("health-light-green");
    else if (planetScore >= 40) healthBarFillEl.classList.add("health-yellow");
    else if (planetScore >= 20) healthBarFillEl.classList.add("health-orange");
    else healthBarFillEl.classList.add("health-red");
  }

  updateScore(); // Call at start to initialize the health bar.

  // ---------------------------
  // 4. Main Game Logic
  // ---------------------------

  /** Renders the current event and its options in the UI. */
  function renderEvent() {
    const event = events[currentIndex];
    yearEl.textContent = `Year ${event.year}`;
    contextEl.textContent = event.context;
    warningEl.textContent = event.warning;
    choicesEl.innerHTML = "";
    nextBtn.classList.add("hidden");
    finalEl.classList.add("hidden");

    event.options.forEach((opt, i) => {
      const btn = document.createElement("div");
      btn.className = "choice";
      // Add option letter (a, b, c, d)
      btn.textContent = `${String.fromCharCode(97 + i)}) ${opt.text}`; 
      btn.dataset.effect = opt.effect;
      
      btn.addEventListener("click", handleChoiceClick);
      choicesEl.appendChild(btn);
    });
  }

  /** Handles the selection of an option. */
  function handleChoiceClick(e) {
    const btn = e.currentTarget;
    const effect = Number(btn.dataset.effect) * 5;
    
    // Calculate the new score, ensuring it stays between 0 and 100
    planetScore = Math.max(0, Math.min(100, planetScore + effect));
    updateScore();

    // Disable all options and highlight the chosen one
    Array.from(choicesEl.children).forEach(c => c.classList.add("disabled"));
    btn.classList.remove("disabled");
    btn.classList.add("selected");

    nextBtn.classList.remove("hidden");
  }

  /** Handles the click on the "Next Year" button. */
  nextBtn.addEventListener("click", () => {
    currentIndex++;
    if (currentIndex < events.length) renderEvent();
    else endGame();
  });

  /** Ends the game and displays the final message. */
  function endGame() {
    nextBtn.classList.add("hidden");
    yearEl.textContent = "Simulation End";
    contextEl.textContent = "";
    warningEl.textContent = "";

    let message = "";
    if (planetScore >= 80) message = "The planet thrives. Humanity acted in time.";
    else if (planetScore >= 50) message = "The planet survives with difficulty, but there is still hope.";
    else message = "The planet collapsed. Decisions were insufficient.";

    finalEl.textContent = message;
    finalEl.classList.remove("hidden");
    choicesEl.innerHTML = "";
  }
  
  renderEvent(); // Start the first game event

  // ===========================================
  // 5. THREE.JS: Initialization and Animation
  // ===========================================

  // Assume THREE is available globally
  const canvas = document.getElementById("earthCanvas");
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  
  let earth; // Variable for the Earth sphere

  /** Adjusts the renderer and camera size to the container. */
  function resizeRenderer() {
    const rect = canvas.parentElement.getBoundingClientRect();
    const w = Math.max(300, Math.floor(rect.width));
    const h = Math.max(200, Math.floor(rect.height));
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }

  window.addEventListener('resize', resizeRenderer);

  // Lights
  const amb = new THREE.AmbientLight(0xffffff, 0.35); // Ambient light
  scene.add(amb);
  const dir = new THREE.DirectionalLight(0xffffff, 0.9); // Directional light (Sun)
  dir.position.set(5, 3, 5);
  scene.add(dir);

  /** Creates and configures the 3D Earth model. */
  function createEarth() {
      const sphereGeo = new THREE.SphereGeometry(2, 64, 64);
      const placeholderMat = new THREE.MeshStandardMaterial({ color: 0x003366 });
      earth = new THREE.Mesh(sphereGeo, placeholderMat);
      scene.add(earth);
      camera.position.z = 6;
      resizeRenderer(); // Ensure initial size
  }

  /** Loads day and night textures. */
  function loadTextures() {
      const loader = new THREE.TextureLoader();
      
      // Day Texture
      loader.load(
          'assets/earth_texture.jpg',
          (texture) => {
              earth.material.map = texture;
              earth.material.color.setHex(0xffffff);
              earth.material.needsUpdate = true;
          },
          undefined,
          () => console.warn('Could not load day texture. Using solid color.')
      );

      // Night Texture (City Lights)
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
          (err) => console.warn('Could not load night texture.', err)
      );
  }

  createEarth();
  loadTextures();

  // ---------------------------
  // 6. Day / Night Logic
  // ---------------------------
  
  let dayProgress = 1; // 1 = Day, 0 = Night
  const dayNightDuration = 60 * 1000; // 60 seconds per full cycle
  let lastTime = Date.now();
  let dayToNight = true; // Indicates if we are transitioning from day to night

  /** Logic for smoothly transitioning between Day and Night mode. */
  function updateDayNight() {
    const now = Date.now();
    const delta = now - lastTime;
    lastTime = now;

    const step = delta / dayNightDuration;
    // Increment or decrement progress
    dayProgress += dayToNight ? -step : step;

    // Change direction when reaching limits
    if (dayProgress <= 0) { dayProgress = 0; dayToNight = false; }
    else if (dayProgress >= 1) { dayProgress = 1; dayToNight = true; }

    // Interpolate background color (CSS)
    const p = dayProgress;
    
    // Colors used in the CSS background
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
    
    // Interpolate light intensity (Three.js)
    amb.intensity = 0.05 + 0.3 * p;
    dir.intensity = 0.2 + 0.7 * p;

    // Control the city light intensity
    if (nightTexture) {
      earth.material.emissiveIntensity = (1 - p) * 5; // Stronger at night (p=0)
    }
  }
  
  // ---------------------------
  // 7. Animation Loop
  // ---------------------------

  /** Main rendering and animation loop. */
  function animate() {
    requestAnimationFrame(animate);
    
    // Constant Earth rotation
    earth.rotation.y += 0.0018; 
    
    // Slight oscillation for dynamism
    earth.rotation.x = 0.02 * Math.sin(Date.now() * 0.0005); 

    updateDayNight(); // Update day/night transition
    renderer.render(scene, camera);
  }

  animate(); // Start the animation loop
}
