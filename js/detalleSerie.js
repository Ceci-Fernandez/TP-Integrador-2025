// 📺 SISTEMA DINÁMICO DE DETALLES DE SERIE + FAVORITOS - CILA MOVIES

let temporadaActual = 1
let serieActual = null

function obtenerParametroURL(nombre) {
  const urlParams = new URLSearchParams(window.location.search)
  return urlParams.get(nombre)
}

function obtenerIdSerie() {
  return obtenerParametroURL("id") || "serie-1"
}

function extraerIdYouTube(url) {
  const regex = /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/
  const match = url.match(regex)
  return match ? match[1] : "dQw4w9WgXcQ"
}

function generarTrailerHTML(serie) {
  const videoId = extraerIdYouTube(serie.trailer)
  return `
    <div class="video-container">
      <iframe 
        width="360" 
        height="215" 
        src="https://www.youtube.com/embed/${videoId}"
        title="Trailer de ${serie.titulo}"
        allowfullscreen
        loading="lazy">
      </iframe>
    </div>
  `
}

function generarActoresHTML(actores) {
  return actores
    .map((actor) => `<a href="${actor.wikipedia}" target="_blank" rel="noopener noreferrer">${actor.nombre}</a>`)
    .join(", ")
}

function generarBotonFavoritos(serie) {
  return `
    <button 
      id="btnFavorito" 
      class="btn-favorito" 
      data-serie-id="${serie.id}"
      data-titulo="${serie.titulo}"
      data-año="${serie.año}"
      data-genero="${serie.genero.join(", ")}"
      data-imagen="${serie.imagen}"
      data-tipo="serie"
      onclick="toggleFavorito(this)"
      title="Agregar a favoritos"
    >
      <svg class="corazon-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
      </svg>
      <span class="favorito-texto">Favorito</span>
    </button>
  `
}

function generarTemporadasHTML(serie) {
  const numTemporadas = serie.temporadas || 3
  return `
    <div class="temporadas">
      ${Array.from(
        { length: numTemporadas },
        (_, i) =>
          `<span class="${i === 0 ? "aseleccionada" : ""}" 
               onclick="cambiarTemporada(${i + 1})"
               data-temporada="${i + 1}">
           Temporada ${i + 1}
         </span>`,
      ).join("")}
    </div>
  `
}

function generarEpisodiosHTML(serie, numeroTemporada) {
  if (!serie.capitulos) {
    return `
      <div class="card-container">
        <div class="temporada-info">
          <h3>Temporada ${numeroTemporada}</h3>
          <p>Esta temporada contiene múltiples episodios de "${serie.titulo}"</p>
        </div>
      </div>
    `
  }

  return `
    <div class="card-container">
      ${serie.capitulos
        .map(
          (capitulo) => `
        <div class="card">
          <p>Capítulo ${capitulo.numero}</p>
          <a href="reproductor.html?serie=${serie.id}&temporada=${numeroTemporada}&capitulo=${capitulo.numero}">
            <img src="${capitulo.imagen}" alt="${capitulo.titulo}">
          </a>
          <p class="episodio-titulo">${capitulo.titulo}</p>
        </div>
      `,
        )
        .join("")}
    </div>
  `
}

function generarSimilaresHTML(serieActual) {
  if (!window.catalogoCompleto) return ""

  const seriesSimilares = window.catalogoCompleto.series.filter((s) => s.id !== serieActual.id).slice(0, 5)

  return `
    <section class="similares">
      <h2>Similares</h2>
      <div class="container">
        <div class="card-container">
          ${seriesSimilares
            .map(
              (serie) => `
            <div class="card">
              <a href="detalleSerie.html?id=${serie.id}">
                <img src="${serie.imagen}" alt="${serie.titulo}">
              </a>
            </div>
          `,
            )
            .join("")}
        </div>
      </div>
    </section>
  `
}

function generarContenidoSerie(serie) {
  return `
    <section class="container">
      ${generarTrailerHTML(serie)}
      
      <div class="info">
        <h2>${serie.titulo}</h2>
        <p><strong>Duración:</strong> ${serie.duracion}</p>
        <p><strong>Género:</strong> ${serie.genero.join(", ")}</p>
        <p><strong>Actores:</strong> ${generarActoresHTML(serie.actores)}</p>
        <p><strong>Resumen:</strong> ${serie.resumen}</p>
        
        <div class="acciones-serie">
          <a class="button" href="${serie.trailer}" target="_blank">Comenzar</a>
          ${generarBotonFavoritos(serie)}
        </div>
      </div>
    </section>

    <section class="similares">
      ${generarTemporadasHTML(serie)}
      <div class="container" id="episodios-container">
        ${generarEpisodiosHTML(serie, temporadaActual)}
      </div>
    </section>

    ${generarSimilaresHTML(serie)}
  `
}

function cambiarTemporada(numeroTemporada) {
  temporadaActual = numeroTemporada

  document.querySelectorAll(".temporadas span").forEach((span) => {
    span.classList.remove("aseleccionada")
  })
  document.querySelector(`[data-temporada="${numeroTemporada}"]`).classList.add("aseleccionada")

  const episodiosContainer = document.getElementById("episodios-container")
  episodiosContainer.innerHTML = generarEpisodiosHTML(serieActual, numeroTemporada)
}

async function cargarSerie() {
  const loadingState = document.getElementById("loading-state")
  const errorState = document.getElementById("error-state")
  const contentContainer = document.getElementById("serie-content")

  try {
    if (!window.catalogoCompleto) {
      await new Promise((resolve) => {
        const check = () => {
          if (window.catalogoCompleto) resolve()
          else setTimeout(check, 100)
        }
        check()
      })
    }

    const serieId = obtenerIdSerie()
    const serie = window.catalogoCompleto.series.find((s) => s.id === serieId)

    if (!serie) throw new Error("Serie no encontrada")

    serieActual = serie
    const contenidoHTML = generarContenidoSerie(serie)
    contentContainer.innerHTML = contenidoHTML

    document.getElementById("page-title").textContent = `CILA Movies - ${serie.titulo}`
    document.title = `CILA Movies - ${serie.titulo}`

    loadingState.style.display = "none"
    contentContainer.style.display = "block"

    setTimeout(verificarEstadoFavorito, 100)
  } catch (error) {
    loadingState.style.display = "none"
    errorState.style.display = "block"
  }
}

function toggleFavorito(boton) {
  const usuarioLogueado = JSON.parse(localStorage.getItem("usuarioLogueado"))
  if (!usuarioLogueado?.email) {
    alert("Debes iniciar sesión para agregar favoritos")
    window.location.href = "../html/login.html"
    return
  }

  const datosSerie = {
    id: boton.dataset.serieId,
    titulo: boton.dataset.titulo,
    año: boton.dataset.año,
    genero: boton.dataset.genero,
    imagen: boton.dataset.imagen,
    tipo: "serie",
  }

  const claveUsuario = `favoritos_${usuarioLogueado.email}`
  const favoritosUsuario = JSON.parse(localStorage.getItem(claveUsuario)) || []

  const indiceExistente = favoritosUsuario.findIndex((item) => item.id === datosSerie.id)
  const yaEsFavorito = indiceExistente !== -1

  if (yaEsFavorito) {
    favoritosUsuario.splice(indiceExistente, 1)
    boton.classList.remove("activo")
    alert(`"${datosSerie.titulo}" eliminado de favoritos`)
  } else {
    favoritosUsuario.push(datosSerie)
    boton.classList.add("activo")
    alert(`"${datosSerie.titulo}" agregado a favoritos`)
  }

  localStorage.setItem(claveUsuario, JSON.stringify(favoritosUsuario))
}

function verificarEstadoFavorito() {
  const usuarioLogueado = JSON.parse(localStorage.getItem("usuarioLogueado"))
  const btnFavorito = document.getElementById("btnFavorito")

  if (!usuarioLogueado || !btnFavorito) return

  const favoritosUsuario = JSON.parse(localStorage.getItem(`favoritos_${usuarioLogueado.email}`)) || []
  const serieId = btnFavorito.dataset.serieId

  if (favoritosUsuario.find((fav) => fav.id === serieId)) {
    btnFavorito.classList.add("activo")
  }
}

document.addEventListener("DOMContentLoaded", cargarSerie)

window.cambiarTemporada = cambiarTemporada
window.toggleFavorito = toggleFavorito
