/**
 * EDITA AQUÍ TU ANIMACIÓN
 * Cada canal (y, x, scale, rx, ry, rz, opacity) tiene fotogramas clave.
 * at: porcentaje del recorrido (0 a 100)
 * value: valor en px, grados, escala o transparencia según el canal
 * ease: "smooth" (suave) o "linear" hasta el siguiente fotograma.
 * Para añadir otro movimiento, inserta fotogramas en el canal deseado.
 */
const CONFIG = {
  followSpeed: 4.5, // Respuesta suave al scroll (unidades por segundo)
  cubeSize: 160,     // Debe coincidir con --cube-size en styles.css
  exitMargin: 160,   // Espacio extra para que el cubo quede fuera de pantalla
};

// Los desplazamientos verticales se expresan en unidades de altura visible:
// -1 = por encima de la pantalla, 0 = centro, +1 = por debajo.
// El motor añade el margen necesario para ocultar totalmente el cubo.
const TIMELINE = {
  y: [
    { at: 0,   value: -1, ease: 'smooth' },
    { at: 35,  value:  0, ease: 'smooth' },
    { at: 75,  value:  0, ease: 'smooth' },
    { at: 100, value:  1 },
  ],
  x: [
    { at: 0, value: 0 },
    { at: 100, value: 0 },
  ],
  rx: [
    { at: 0,  value: -20 },
    { at: 48, value: -20, ease: 'smooth' },
    { at: 75, value: 100 },
    { at: 100, value: 100 },
  ],
  ry: [
    { at: 0,  value: 25 },
    { at: 48, value: 25, ease: 'smooth' },
    { at: 75, value: 205 },
    { at: 100, value: 205 },
  ],
  rz: [
    { at: 0,  value: 0 },
    { at: 48, value: 0, ease: 'smooth' },
    { at: 75, value: 8 },
    { at: 100, value: 8 },
  ],
  scale: [
    { at: 0, value: 1 },
    { at: 100, value: 1 },
  ],
  opacity: [
    { at: 0, value: 1 },
    { at: 100, value: 1 },
  ],
};

/**
 * TEXTOS DE EJEMPLO
 * Añade entradas aquí para mostrar más mensajes.
 * Los porcentajes van de 0 a 100 y deben cumplir:
 * fadeInStart < fadeInEnd <= fadeOutStart < fadeOutEnd.
 * y: posición vertical respecto al centro en píxeles
 * (negativo = arriba del cubo; positivo = abajo).
 * move: distancia vertical en px durante la aparición y desaparición.
 * className: opcional, por ejemplo 'small'.
 */
const TEXTS = [
  {
    text: 'Todo empieza con una forma.',
    fadeInStart: 12, fadeInEnd: 20,
    fadeOutStart: 32, fadeOutEnd: 40,
    y: -185, move: 20, className: '',
  },
  {
    text: 'Un pequeño giro puede cambiar la perspectiva.',
    fadeInStart: 48, fadeInEnd: 56,
    fadeOutStart: 67, fadeOutEnd: 75,
    y: 185, move: 18, className: 'small',
  },
  {
    text: 'Y el movimiento continúa.',
    fadeInStart: 79, fadeInEnd: 85,
    fadeOutStart: 92, fadeOutEnd: 99,
    y: -135, move: 15, className: '',
  },
];

const section = document.querySelector('#scroll-section');
const scene = document.querySelector('#scene');
const positionElement = document.querySelector('#cube-position');
const cube = document.querySelector('#cube');
const textLayer = document.querySelector('#text-layer');

// Cada texto se crea automáticamente: no necesitas editar index.html.
const textElements = TEXTS.map(item => {
  const element = document.createElement('p');
  element.className = `animated-text ${item.className || ''}`.trim();
  element.textContent = item.text;
  textLayer.appendChild(element);
  return element;
});

function clamp(n, min = 0, max = 1) {
  return Math.max(min, Math.min(max, n));
}

function ease(t, type = 'smooth') {
  return type === 'linear' ? t : t * t * (3 - 2 * t);
}

function sample(keys, progress) {
  if (progress <= keys[0].at) return keys[0].value;
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i];
    const b = keys[i + 1];
    if (progress <= b.at) {
      const fraction = clamp((progress - a.at) / (b.at - a.at));
      const t = ease(fraction, a.ease);
      return a.value + (b.value - a.value) * t;
    }
  }
  return keys[keys.length - 1].value;
}

let target = 0;
let current = 0;
let previousTime = null;

function onScroll() {
  const travel = section.offsetHeight - scene.offsetHeight;
  target = travel > 0
    ? clamp(-section.getBoundingClientRect().top / travel) * 100
    : 0;
}

function render(time) {
  if (previousTime === null) previousTime = time;
  const dt = Math.min((time - previousTime) / 1000, 0.05);
  previousTime = time;

  const blend = 1 - Math.exp(-CONFIG.followSpeed * dt);
  current += (target - current) * blend;

  const offscreen = scene.clientHeight / 2
    + Math.sqrt(3) * CONFIG.cubeSize / 2
    + CONFIG.exitMargin;

  const x = sample(TIMELINE.x, current);
  const y = sample(TIMELINE.y, current) * offscreen;
  const rx = sample(TIMELINE.rx, current);
  const ry = sample(TIMELINE.ry, current);
  const rz = sample(TIMELINE.rz, current);
  const scale = sample(TIMELINE.scale, current);
  const opacity = clamp(sample(TIMELINE.opacity, current));

  positionElement.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  positionElement.style.opacity = opacity;
  cube.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg) scale(${scale})`;

  // Fade in, permanencia y fade out sincronizados con el scroll.
  TEXTS.forEach((item, i) => {
    const fadeIn = ease(clamp((current - item.fadeInStart) /
      (item.fadeInEnd - item.fadeInStart)));
    const fadeOut = ease(clamp((current - item.fadeOutStart) /
      (item.fadeOutEnd - item.fadeOutStart)));
    const opacity = fadeIn * (1 - fadeOut);
    // Deslizamiento muy sutil hacia su posición al entrar y al salir.
    const offset = (1 - fadeIn) * item.move - fadeOut * item.move;
    textElements[i].style.opacity = opacity;
    textElements[i].style.transform =
      `translate3d(-50%, calc(-50% + ${item.y + offset}px), 0)`;
  });

  requestAnimationFrame(render);
}

window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('resize', onScroll);
onScroll();
requestAnimationFrame(render);
