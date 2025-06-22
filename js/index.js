/* Datos de películas y series
const allMovies = [
  { id: 1, title: "El Eternauta", type: "serie", category: "drama", image: "img/peliculas/eleternauta1280x720.jpg" },
  {
    id: 2,
    title: "Misión Imposible",
    type: "pelicula",
    category: "accion",
    image: "img/peliculas/mision-imposible.jpg",
  },
  { id: 3, title: "Friends", type: "serie", category: "comedia", image: "img/peliculas/friends.jpg" },
  { id: 4, title: "The Truman Show", type: "pelicula", category: "drama", image: "img/peliculas/the-truman-show.jpg" },
  { id: 5, title: "The Walking Dead", type: "serie", category: "terror", image: "img/peliculas/the-walking-dead.jpg" },
  {
    id: 6,
    title: "Django Unchained",
    type: "pelicula",
    category: "western",
    image: "img/peliculas/django-unchained.jpg",
  },
  {
    id: 7,
    title: "Las Cuatro Estaciones",
    type: "serie",
    category: "drama",
    image: "img/peliculas/las-cuatro-estaciones.jpg",
  },
  {
    id: 8,
    title: "Minecraft The Movie",
    type: "pelicula",
    category: "aventura",
    image: "img/peliculas/minecraft-the-movie.jpg",
  },
  { id: 9, title: "Rick y Morty", type: "serie", category: "comedia", image: "img/peliculas/rick-y-morty.jpg" },
  { id: 10, title: "You Temporada 5", type: "serie", category: "terror", image: "img/peliculas/you-temporada-5.jpg" },
]*/

let currentFilter = ""
let currentSearch = ""
let isLoggedIn = false
let currentUser = null

// Inicializar página
document.addEventListener("DOMContentLoaded", () => {
  checkLoginStatus()
  loadMovies()
  loadTrending()
})

// Verificar estado de login
function checkLoginStatus() {
  const user = localStorage.getItem("currentUser")
  if (user) {
    isLoggedIn = true
    currentUser = JSON.parse(user)
    updateUIForLoggedUser()
  }
}

// Actualizar UI para usuario logueado
function updateUIForLoggedUser() {
  const authSection = document.getElementById("auth-section")
  const footerAuth = document.getElementById("footer-auth")
  const heroBtn = document.getElementById("hero-btn")

  authSection.innerHTML = `
    <a href="html/perfil.html">
      <img src="img/img-usuario.jpeg" alt="Avatar" class="user-avatar">
    </a>
  `

  footerAuth.innerHTML = '<a href="html/perfil.html">Perfil</a>'
  heroBtn.textContent = "Ver Más"
  heroBtn.href = "html/detalle-serie.html?id=1"
}

// Cargar películas
function loadMovies(movies = allMovies) {
  const grid = document.getElementById("movies-grid")
  grid.innerHTML = ""

  movies.forEach((movie) => {
    const movieElement = document.createElement("div")
    movieElement.className = "pelicula"

    const detailPage = movie.type === "serie" ? "html/detalle-serie.html" : "html/detalle-pelicula.html"

    movieElement.innerHTML = `
      <a href="${detailPage}?id=${movie.id}">
        <img src="${movie.image}" alt="${movie.title}">
      </a>
      ${
        isLoggedIn
          ? `<i class="bi ${isFavorite(movie.id) ? "bi-heart-fill" : "bi-heart"} favorite-heart" onclick="toggleFavorite(${movie.id})" data-id="${movie.id}"></i>
`
          : ""
      }
    `

    grid.appendChild(movieElement)
  })
}

// Cargar tendencias
function loadTrending() {
  const grid = document.getElementById("trending-grid")
  grid.innerHTML = ""

  allMovies.slice(0, 5).forEach((movie, index) => {
    const trendingElement = document.createElement("a")
    trendingElement.className = "tendencia"
    trendingElement.href =
      movie.type === "serie" ? `html/detalle-serie.html?id=${movie.id}` : `html/detalle-pelicula.html?id=${movie.id}`

    trendingElement.innerHTML = `
      <img src="${movie.image}" alt="${movie.title}">
      <span class="numero">${index + 1}</span>
    `

    grid.appendChild(trendingElement)
  })
}

// Filtrar por tipo (película/serie)
function filterMovies(type) {
  currentFilter = type
  applyFilters()
}

// Filtrar por categoría
function filterByCategory() {
  const category = document.getElementById("categoria").value
  currentFilter = category
  applyFilters()
}

// Buscar películas
function searchMovies() {
  const searchTerm = document.getElementById("search-input").value
  currentSearch = searchTerm
  applyFilters()
}

// Aplicar filtros
function applyFilters() {
  let filtered = [...allMovies]

  // Filtrar por búsqueda
  if (currentSearch) {
    filtered = filtered.filter((movie) => movie.title.toLowerCase().includes(currentSearch.toLowerCase()))
  }

  // Filtrar por tipo o categoría
  if (currentFilter) {
    if (currentFilter === "pelicula" || currentFilter === "serie") {
      filtered = filtered.filter((movie) => movie.type === currentFilter)
    } else {
      filtered = filtered.filter((movie) => movie.category === currentFilter)
    }
  }

  loadMovies(filtered)
}

// Verificar si es favorito
function isFavorite(movieId) {
  if (!isLoggedIn) return false
  const favorites = JSON.parse(localStorage.getItem("favorites") || "{}")
  const userFavorites = favorites[currentUser.email] || []
  return userFavorites.includes(movieId)
}

// Toggle favorito
function toggleFavorite(movieId) {
  if (!isLoggedIn) return

  const favorites = JSON.parse(localStorage.getItem("favorites") || "{}")
  const userFavorites = favorites[currentUser.email] || []

  const index = userFavorites.indexOf(movieId)
  if (index === -1) {
    userFavorites.push(movieId)
  } else {
    userFavorites.splice(index, 1)
  }

  favorites[currentUser.email] = userFavorites
  localStorage.setItem("favorites", JSON.stringify(favorites))
  loadMovies()
}

// Event listener para búsqueda en tiempo real
document.getElementById("search-input").addEventListener("input", function () {
  currentSearch = this.value
  applyFilters()
})
