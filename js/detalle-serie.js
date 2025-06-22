let temporadaActual = 1
let episodioActual = 1
let serieActual = null
let usuarioActual = null

// Importar catálogos unificados desde catalogo.js
// Los catálogos se cargan desde el archivo catalogo.js incluido en el HTML

// Declaración de variables globales (simulando la carga desde catalogo.js)
const catalogoSeries = {}
const temporadas = {}
const allMovies = []
const similaresFiltradas = []

document.addEventListener("DOMContentLoaded", () => {
  verificarEstadoLogin()
  cargarDetalleSerie()
  cargarEpisodios()
  cargarSelectorEpisodios()
  cargarSeriesSimilares()
  verificarSiEsFavorito()
})

function verificarEstadoLogin() {
  const usuario = localStorage.getItem("currentUser")
  if (usuario) {
    usuarioActual = JSON.parse(usuario)
    actualizarUIParaUsuarioLogueado()
  }
}

function actualizarUIParaUsuarioLogueado() {
  const seccionAuth = document.getElementById("auth-section")
  const footerAuth = document.getElementById("footer-auth")

  seccionAuth.innerHTML = `
    <a href="perfil.html">
      <img src="../img/img-usuario.jpeg" alt="Avatar" class="user-avatar" />
    </a>
  `
  footerAuth.innerHTML = '<a href="perfil.html">Perfil</a>'
}

function cargarDetalleSerie() {
  const parametrosURL = new URLSearchParams(window.location.search)
  const idSerie = Number.parseInt(parametrosURL.get("id"))

  if (!idSerie) {
    document.getElementById("episode-title").textContent = "ID de serie no especificado"
    document.getElementById("page-title").textContent = "CILA MOVIES - Error"
    return
  }

  serieActual = idSerie

  const serie = catalogoSeries[idSerie]
  if (!serie) {
    document.getElementById("episode-title").textContent = "Serie no encontrada"
    document.getElementById("page-title").textContent = "CILA MOVIES - Serie no encontrada"
    return
  }

  // Actualizar título de la página
  document.getElementById("page-title").textContent = `CILA MOVIES - ${serie.titulo}`

  // Cargar datos de la serie
  document.getElementById("episode-title").textContent =
    `${serie.titulo} - Temporada ${temporadaActual} Capítulo ${episodioActual}`
  document.getElementById("series-duration").textContent = serie.duracion
  document.getElementById("series-genre").textContent = serie.genero
  document.getElementById("series-summary").textContent = serie.resumen

  // Cargar actores
  const contenedorActores = document.getElementById("series-actors")
  let actoresHTML = "<strong>Actores:</strong> "
  serie.actores.forEach((actor, index) => {
    if (index > 0) actoresHTML += ", "
    actoresHTML += `<a class="color_actores" href="${actor.enlace}" target="_blank">${actor.nombre}</a>`
  })
  contenedorActores.innerHTML = actoresHTML

  // Cargar trailer
  const iframe = document.getElementById("trailer-iframe")
  iframe.src = `https://www.youtube.com/embed/${serie.trailer}`

  generarTabsTemporadas()
}

function generarTabsTemporadas() {
  const contenedorTemporadas = document.getElementById("seasons-tabs")
  contenedorTemporadas.innerHTML = ""

  const temporadasSerie = temporadas[serieActual]
  if (!temporadasSerie) return

  Object.keys(temporadasSerie).forEach((numTemporada, index) => {
    const tab = document.createElement(index === 0 ? "span" : "a")
    tab.className = index === 0 ? "aseleccionada" : ""
    tab.textContent = `Temporada ${numTemporada}`
    tab.href = index === 0 ? undefined : "#"
    tab.onclick = () => seleccionarTemporada(Number.parseInt(numTemporada))
    contenedorTemporadas.appendChild(tab)
  })
}

function cargarSelectorEpisodios() {
  const selectorEpisodios = document.getElementById("episode-select")
  const selectorTemporadas = document.getElementById("season-select")

  // Cargar selector de temporadas
  selectorTemporadas.innerHTML = ""
  const temporadasSerie = temporadas[serieActual]
  if (temporadasSerie) {
    Object.keys(temporadasSerie).forEach((numTemporada) => {
      const opcion = document.createElement("option")
      opcion.value = numTemporada
      opcion.textContent = `Temporada ${numTemporada}`
      if (Number.parseInt(numTemporada) === temporadaActual) opcion.selected = true
      selectorTemporadas.appendChild(opcion)
    })
  }

  // Cargar selector de episodios
  selectorEpisodios.innerHTML = ""
  const cantidadEpisodios = temporadasSerie[temporadaActual]?.episodios || 0

  for (let i = 1; i <= cantidadEpisodios; i++) {
    const opcion = document.createElement("option")
    opcion.value = i
    opcion.textContent = `Capítulo ${i}`
    if (i === episodioActual) opcion.selected = true
    selectorEpisodios.appendChild(opcion)
  }
}

function cargarEpisodios() {
  const contenedor = document.getElementById("episodes-container")
  contenedor.innerHTML = ""

  const temporadasSerie = temporadas[serieActual]
  const cantidadEpisodios = temporadasSerie[temporadaActual]?.episodios || 0

  // Obtener la imagen de la serie actual
  const serie = catalogoSeries[serieActual]
  const imagenSerie = serie ? serie.imagen : "../img/img-twd-serie/capi1.avif"

  for (let i = 1; i <= cantidadEpisodios; i++) {
    const elementoEpisodio = document.createElement("div")
    elementoEpisodio.className = "card"
    elementoEpisodio.innerHTML = `
      <p>Capítulo ${i}</p>
      <a href="#" onclick="seleccionarEpisodio(${i})">
        <img src="${imagenSerie}" alt="Capítulo ${i}">
      </a>
    `
    contenedor.appendChild(elementoEpisodio)
  }
}

function cargarSeriesSimilares() {
  const contenedorSimilares = document.getElementById("similar-series")
  contenedorSimilares.innerHTML = ""

  // Usar el catálogo unificado allMovies para obtener solo series
  const todasLasSeries = allMovies.filter((movie) => movie.type === "serie")

  similaresFiltradas.forEach((serie) => {
    const tarjetaSerie = document.createElement("div")
    tarjetaSerie.className = "card"
    tarjetaSerie.innerHTML = `
      <a href="detalle-serie.html?id=${serie.id}">
        <img src="${serie.image}" alt="${serie.title}">
        <p>${serie.title}</p>
      </a>
    `
    contenedorSimilares.appendChild(tarjetaSerie)
  })
}

function seleccionarTemporada(temporada) {
  temporadaActual = temporada
  episodioActual = 1

  // Actualizar tabs
  document.querySelectorAll("#seasons-tabs span, #seasons-tabs a").forEach((tab) => {
    tab.className = ""
  })

  // Marcar temporada seleccionada
  const tabs = document.querySelectorAll("#seasons-tabs span, #seasons-tabs a")
  if (tabs[temporada - 1]) {
    tabs[temporada - 1].className = "aseleccionada"
  }

  document.getElementById("season-select").value = temporada
  cargarEpisodios()
  cargarSelectorEpisodios()
  actualizarTituloEpisodio()
}

function seleccionarEpisodio(episodio) {
  episodioActual = episodio
  document.getElementById("episode-select").value = episodio
  actualizarTituloEpisodio()
  watchEpisode()
}

function changeSeason() {
  const temporada = Number.parseInt(document.getElementById("season-select").value)
  seleccionarTemporada(temporada)
}

function changeEpisode() {
  episodioActual = Number.parseInt(document.getElementById("episode-select").value)
  actualizarTituloEpisodio()
}

function actualizarTituloEpisodio() {
  const serie = catalogoSeries[serieActual]
  if (serie) {
    document.getElementById("episode-title").textContent =
      `${serie.titulo} - Temporada ${temporadaActual} Capítulo ${episodioActual}`
  }
}

function watchEpisode() {
  const temporadasSerie = temporadas[serieActual]
  const videoId = temporadasSerie[temporadaActual]?.videoId
  const serie = catalogoSeries[serieActual]
  const titulo = `${serie.titulo} - Temporada ${temporadaActual} Capítulo ${episodioActual}`

  window.open(`reproductor.html?video=${videoId}&title=${encodeURIComponent(titulo)}`, "_blank")
}

function toggleFavoriteFromDetail() {
  if (!usuarioActual) {
    alert("Iniciá sesión para agregar a favoritos.")
    return
  }

  const emailUsuario = usuarioActual.email
  const favorites = JSON.parse(localStorage.getItem("favorites") || "{}")
  const userFavorites = favorites[emailUsuario] || []

  const index = userFavorites.indexOf(serieActual)

  if (index >= 0) {
    userFavorites.splice(index, 1)
    alert("Quitado de favoritos")
  } else {
    userFavorites.push(serieActual)
    alert("Agregado a favoritos")
  }

  favorites[emailUsuario] = userFavorites
  localStorage.setItem("favorites", JSON.stringify(favorites))
  verificarSiEsFavorito()
}

function verificarSiEsFavorito() {
  if (!usuarioActual) return

  const icono = document.getElementById("favorite-icon")
  const favorites = JSON.parse(localStorage.getItem("favorites") || "{}")
  const userFavorites = favorites[usuarioActual.email] || []

  if (userFavorites.includes(serieActual)) {
    icono.classList.remove("bi-heart")
    icono.classList.add("bi-heart-fill")
  }
}
