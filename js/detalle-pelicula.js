let usuarioActual = null
let peliculaActual = null

document.addEventListener("DOMContentLoaded", () => {
  verificarEstadoLogin()
  cargarDetallePelicula()
  cargarPeliculasSimilares()
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

// Importa los catálogos
import { catalogoPeliculas, allMovies } from "./catalogo.js"

function cargarDetallePelicula() {
  const parametrosURL = new URLSearchParams(window.location.search)
  const idPelicula = Number.parseInt(parametrosURL.get("id"))

  if (!idPelicula || isNaN(idPelicula)) {
    console.log("ID inválido:", parametrosURL.get("id"))
    return
  }

  peliculaActual = idPelicula

  // Usar el catálogo unificado de catalogo.js
  const pelicula = catalogoPeliculas[idPelicula]
  if (!pelicula) {
    console.log("Película no encontrada para ID:", idPelicula)
    console.log("Catálogo disponible:", Object.keys(catalogoPeliculas))
    return
  }

  // Actualizar título de la página
  document.getElementById("page-title").textContent = `CILA MOVIES - ${pelicula.titulo}`

  // Cargar datos de la película
  document.getElementById("movie-title").textContent = pelicula.titulo
  document.getElementById("movie-duration").textContent = pelicula.duracion
  document.getElementById("movie-genre").textContent = pelicula.genero
  document.getElementById("movie-summary").textContent = pelicula.resumen

  // Cargar actores
  const contenedorActores = document.getElementById("movie-actors")
  let actoresHTML = "<strong>Actores:</strong> "
  pelicula.actores.forEach((actor, index) => {
    if (index > 0) actoresHTML += ", "
    actoresHTML += `<a class="color_actores" href="${actor.enlace}" target="_blank">${actor.nombre}</a>`
  })
  contenedorActores.innerHTML = actoresHTML

  // Cargar trailer
  const iframe = document.getElementById("trailer-iframe")
  iframe.src = `https://www.youtube.com/embed/${pelicula.trailer}`
}

function cargarPeliculasSimilares() {
  const contenedorSimilares = document.getElementById("similar-movies")
  contenedorSimilares.innerHTML = ""

  // Usar el catálogo unificado allMovies para obtener solo películas
  const todasLasPeliculas = allMovies.filter((movie) => movie.type === "pelicula")

  // Filtrar excluyendo la película actual y tomar máximo 3
  const similaresFiltradas = todasLasPeliculas.filter((p) => p.id !== peliculaActual).slice(0, 3)

  similaresFiltradas.forEach((pelicula) => {
    const tarjetaPelicula = document.createElement("div")
    tarjetaPelicula.className = "card"
    tarjetaPelicula.innerHTML = `
      <a href="detalle-pelicula.html?id=${pelicula.id}">
        <img src="${pelicula.image}" alt="${pelicula.title}">
        <p>${pelicula.title}</p>
      </a>
    `
    contenedorSimilares.appendChild(tarjetaPelicula)
  })
}

function watchMovie() {
  const pelicula = catalogoPeliculas[peliculaActual]
  if (!pelicula) return

  window.open(`reproductor.html?video=${pelicula.trailer}&title=${encodeURIComponent(pelicula.titulo)}`, "_blank")
}

function toggleFavoriteFromDetail() {
  if (!usuarioActual) {
    alert("Iniciá sesión para agregar a favoritos.")
    return
  }

  const emailUsuario = usuarioActual.email
  const favorites = JSON.parse(localStorage.getItem("favorites") || "{}")
  const userFavorites = favorites[emailUsuario] || []

  const index = userFavorites.indexOf(peliculaActual)

  if (index >= 0) {
    userFavorites.splice(index, 1)
    alert("Quitado de favoritos")
  } else {
    userFavorites.push(peliculaActual)
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

  if (userFavorites.includes(peliculaActual)) {
    icono.classList.remove("bi-heart")
    icono.classList.add("bi-heart-fill")
  }
}
