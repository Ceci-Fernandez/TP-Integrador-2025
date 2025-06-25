document.addEventListener("DOMContentLoaded", () => {
  const pelicula = {
    titulo: "The Walking Dead. Capítulo 1",
    duracion: "45min",
    genero: "Terror, Suspenso, Acción",
    resumen: "La historia se centra en un grupo de personas que lucha por sobrevivir en un mundo devastado por un apocalipsis zombi, enfrentando tanto amenazas externas como conflictos humanos.",
    trailer: "https://www.youtube.com/embed/sfAc2U20uyg",
    videoPelicula: "https://www.youtube.com/watch?v=sfAc2U20uyg",
    actores: [
      { nombre: "Andrew Lincoln", wikipedia: "https://es.wikipedia.org/wiki/Andrew_Lincoln" },
      { nombre: "Norman Reedus", wikipedia: "https://es.wikipedia.org/wiki/Norman_Reedus" },
      { nombre: "Danai Gurira", wikipedia: "https://es.wikipedia.org/wiki/Danai_Gurira#Teatro" }
    ],
    similares: [
      { titulo: "Minecraft", imagen: "../img/peliculas/minecraft-the-movie.jpg", link: "#" },
      { titulo: "Misión Imposible", imagen: "../img/peliculas/mision-imposible.jpg", link: "#" },
      { titulo: "Las cuatro estaciones", imagen: "../img/peliculas/las-cuatro-estaciones.jpg", link: "#" },
      { titulo: "Django", imagen: "../img/peliculas/django-unchained.jpg", link: "#" },
      { titulo: "Rick y Morty", imagen: "../img/peliculas/rick-y-morty.jpg", link: "#" }
    ]
  };

  const contenedor = document.getElementById("detalle-pelicula");
  if (!contenedor) return;

  contenedor.innerHTML = `
    <section class="container">
      <iframe width="360" height="215" src="${pelicula.trailer}" allowfullscreen></iframe>
      <div class="info">
        <h2>${pelicula.titulo}</h2>
        <p><strong>Duración:</strong> ${pelicula.duracion}</p>
        <p><strong>Género:</strong> ${pelicula.genero}</p>
        <p><strong>Actores:</strong> ${
          pelicula.actores.map(actor => 
            `<a class="color_actores" href="${actor.wikipedia}" target="_blank">${actor.nombre}</a>`
          ).join(', ')
        }</p>
        <p><strong>Resumen:</strong> ${pelicula.resumen}</p>
        <a class="button" href="${pelicula.videoPelicula}" target="_blank">Comenzar</a>
      </div>
    </section>

    <section class="similares">
      <h2>Similares</h2>
      <div class="carrusel-estilo">
        <button class="boton-izquierda"><</button>
        <div class="carrusel" id="carrusel-similares">
          ${
            pelicula.similares.map(similar => `
              <div class="card">
                <a href="${similar.link}">
                  <img src="${similar.imagen}" alt="${similar.titulo}">
                </a>
              </div>
            `).join('')
          }
        </div>
        <button class="boton-derecha">></button>
      </div>
    </section>
  `;

  const carrusel = document.getElementById("carrusel-similares");
  const boton_izquierda = document.querySelector(".boton-izquierda");
  const boton_derecha = document.querySelector(".boton-derecha");

  btnIzq.addEventListener("click", () => {
    carrusel.scrollBy({ left: -carrusel.offsetWidth, behavior: "smooth" });
  });

  btnDer.addEventListener("click", () => {
    carrusel.scrollBy({ left: carrusel.offsetWidth, behavior: "smooth" });
  });
});
