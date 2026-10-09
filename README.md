# Cubo 3D con scroll

Web estática lista para GitHub Pages. Sin dependencias externas.

## Archivos
- `index.html`: estructura del cubo.
- `styles.css`: apariencia, tamaño y duración del recorrido.
- `animation.js`: movimientos, suavizado y textos con fade in/fade out.

## Editar
1. En `styles.css`, cambia `--scroll-height: 900vh` para regular la velocidad global (más alto = más recorrido).
2. En `animation.js`, cambia `TIMELINE` para editar los movimientos de cada propiedad:
   - `y`: altura (-1 fuera por arriba, 0 centro, 1 fuera por abajo)
   - `x`: desplazamiento horizontal en píxeles
   - `rx`, `ry`, `rz`: grados de giro sobre cada eje
   - `scale`: tamaño relativo (1 = tamaño normal)
   - `opacity`: transparencia (0 a 1)
3. Cada clave tiene `at` (0–100) y `value`; `ease: 'smooth'` o `ease: 'linear'` controla cómo se pasa de esa clave a la siguiente.
4. Para una pausa, repite el mismo valor en dos porcentajes separados.
5. Conserva las claves ordenadas por `at` y evita porcentajes repetidos.

Ejemplo de aumento de tamaño entre 40% y 60%:
```js
scale: [
  { at: 0, value: 1 },
  { at: 40, value: 1, ease: 'smooth' },
  { at: 60, value: 1.5, ease: 'smooth' },
  { at: 100, value: 1 },
],
```

## Publicar en GitHub Pages
Sube los tres archivos `index.html`, `styles.css` y `animation.js` a la raíz de un repositorio. En Settings > Pages selecciona Deploy from a branch, `main`, `/ (root)` y guarda.


## Añadir y editar textos
En `animation.js`, busca `const TEXTS = [...]`. Cada entrada es una frase independiente:

```js
{
  text: 'Mi nuevo mensaje',
  fadeInStart: 20, fadeInEnd: 26,
  fadeOutStart: 38, fadeOutEnd: 45,
  y: -170, move: 20, className: '',
},
```

- `text`: lo que se muestra.
- `fadeInStart` y `fadeInEnd`: inicio y fin de la aparición gradual.
- `fadeOutStart` y `fadeOutEnd`: inicio y fin de la desaparición.
- Entre `fadeInEnd` y `fadeOutStart`, el texto se queda visible.
- `y`: posición vertical desde el centro (negativo arriba; positivo abajo).
- `move`: pequeño desplazamiento durante los fades; usa `0` para fade puro.
- `className: 'small'` aplica tipografía más pequeña, `''` tamaño normal.

Mantén los porcentajes entre 0 y 100 y en orden: `fadeInStart < fadeInEnd <= fadeOutStart < fadeOutEnd`.
Puedes añadir tantas entradas como quieras. La web las crea automáticamente; no es necesario tocar `index.html`.
Todo es reversible: subir el scroll revierte tanto el cubo como los textos.
