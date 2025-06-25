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

function cargarDetallePelicula() {
  const parametrosURL = new URLSearchParams(window.location.search)
  const idPelicula = Number.parseInt(parametrosURL.get("id"))

  if (!idPelicula || isNaN(idPelicula)) {
    console.log("ID inválido:", parametrosURL.get("id"))
    document.getElementById("movie-title").textContent = "Película no encontrada"
    return
  }

  peliculaActual = idPelicula

  
  const pelicula = window.catalogoPeliculas[idPelicula]
  if (!pelicula) {
    console.log("Película no encontrada para ID:", idPelicula)
    document.getElementById("movie-title").textContent = "Película no encontrada"
    return
  }

  document.getElementById("page-title").textContent = `CILA MOVIES - ${pelicula.titulo}`

  
  document.getElementById("movie-title").textContent = pelicula.titulo
  document.getElementById("movie-duration").textContent = pelicula.duracion
  document.getElementById("movie-genre").textContent = pelicula.genero
  document.getElementById("movie-summary").textContent = pelicula.resumen

  const contenedorActores = document.getElementById("movie-actors")
  let actoresHTML = "<strong>Actores:</strong> "
  pelicula.actores.forEach((actor, index) => {
    if (index > 0) actoresHTML += ", "
    actoresHTML += `<a class="color_actores" href="${actor.enlace}" target="_blank">${actor.nombre}</a>`
  })
  contenedorActores.innerHTML = actoresHTML

  
  const iframe = document.getElementById("trailer-iframe")
  iframe.src = `https://www.youtube.com/embed/${pelicula.trailer}`
}

function cargarPeliculasSimilares() {
  const contenedorSimilares = document.getElementById("similar-movies")
  contenedorSimilares.innerHTML = ""

 
  const todasLasPeliculas = window.allMovies.filter((movie) => movie.type === "pelicula")
  const similaresFiltradas = todasLasPeliculas.filter((p) => p.id !== peliculaActual).slice(0, 8)

  const carouselHTML = `
    <div class="carousel-container">
      <button class="carousel-btn prev-btn" onclick="scrollCarousel('similar-carousel', -1)">‹</button>
      <div class="carousel-wrapper">
        <div class="carousel-track" id="similar-carousel">
          ${similaresFiltradas
            .map(
              (pelicula) => `
            <div class="carousel-item">
              <a href="detalle-pelicula.html?id=${pelicula.id}">
                <img src="${pelicula.image}" alt="${pelicula.title}">
                <p>${pelicula.title}</p>
              </a>
            </div>
          `,
            )
            .join("")}
        </div>
      </div>
      <button class="carousel-btn next-btn" onclick="scrollCarousel('similar-carousel', 1)">›</button>
    </div>
  `

  contenedorSimilares.innerHTML = carouselHTML
}

function scrollCarousel(carouselId, direction) {
  const carousel = document.getElementById(carouselId)
  const itemWidth = carousel.querySelector(".carousel-item").offsetWidth + 20 
  const scrollAmount = itemWidth * 2 

  carousel.scrollBy({
    left: direction * scrollAmount,
    behavior: "smooth",
  })
}

function watchMovie() {
  const pelicula = window.catalogoPeliculas[peliculaActual]
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
