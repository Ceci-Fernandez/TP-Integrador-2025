/*const allMovies = [
  { id: 1, title: "El Eternauta", type: "serie", image: "../img/peliculas/eleternauta1280x720.jpg" },
  { id: 2, title: "Misión Imposible", type: "pelicula", image: "../img/peliculas/mision-imposible.jpg" },
  { id: 3, title: "Friends", type: "serie", image: "../img/peliculas/friends.jpg" },
  { id: 4, title: "The Truman Show", type: "pelicula", image: "../img/peliculas/the-truman-show.jpg" },
  { id: 5, title: "The Walking Dead", type: "serie", image: "../img/peliculas/the-walking-dead.jpg" },
  { id: 6, title: "Django Unchained", type: "pelicula", image: "../img/peliculas/django-unchained.jpg" },
  { id: 7, title: "Las Cuatro Estaciones", type: "serie", image: "../img/peliculas/las-cuatro-estaciones.jpg" },
  { id: 8, title: "Minecraft The Movie", type: "pelicula", image: "../img/peliculas/minecraft-the-movie.jpg" },
  { id: 9, title: "Rick y Morty", type: "serie", image: "../img/peliculas/rick-y-morty.jpg" },
  { id: 10, title: "You Temporada 5", type: "serie", image: "../img/peliculas/you-temporada-5.jpg" },
]
*/
// Datos de tarjetas para generar dinámicamente
const cardTypes = [
  { value: "naranja", name: "Tarjeta Naranja", image: "../img/img-tarjetas/tarjeta-naranja@2x.png" },
  { value: "mastercard", name: "Mastercard", image: "../img/img-tarjetas/mastercard@2x.png" },
  { value: "visa", name: "Visa", image: "../img/img-tarjetas/visa@2x.png" },
  { value: "cabal", name: "Cabal", image: "../img/img-tarjetas/cabal@2x.png" },
]

// Métodos de pago alternativos
const alternativePayments = [
  {
    type: "transferencia",
    name: "Transferencia Bancaria",
    image: "../img/transferencia-icon.png",
    data: {
      cbu: "0170329940000012345678",
      alias: "CILA.MOVIES.PAGO",
      titular: "CILA MOVIES S.A.",
      cuit: "30-12345678-9",
      banco: "Banco Nación",
    },
  },
  {
    type: "cupon",
    name: "Cupón de Pago",
    image: "../img/cupon-icon.png",
    options: [
      { value: "pagofacil", name: "Pago Fácil", image: "../img/pagofacil-logo.png" },
      { value: "rapipago", name: "Rapipago", image: "../img/rapipago-logo.png" },
    ],
  },
]

let currentUser = null

document.addEventListener("DOMContentLoaded", () => {
  // Verificar si hay usuario logueado
  const user = localStorage.getItem("currentUser")
  if (!user) {
    window.location.href = "login.html"
    return
  }

  currentUser = JSON.parse(user)
  generateDynamicCards()
  generateAlternativePayments()
  loadUserData()
  loadFavorites()
  setupEventListeners()
})

// Generar tarjetas dinámicamente
function generateDynamicCards() {
  const cardsContainer = document.getElementById("dynamic-cards")
  cardsContainer.innerHTML = ""

  cardTypes.forEach((card) => {
    const cardElement = document.createElement("label")
    cardElement.className = "registro__tarjeta"
    cardElement.innerHTML = `
      <input type="radio" name="tarjeta" value="${card.value}" onchange="showCardDataSection()">
      <img src="${card.image}" alt="${card.name}">
    `
    cardsContainer.appendChild(cardElement)
  })
}

// Generar métodos de pago alternativos dinámicamente
function generateAlternativePayments() {
  const container = document.getElementById("alternative-payments")
  container.innerHTML = "<h4>Otros métodos de pago</h4>"

  alternativePayments.forEach((method) => {
    const methodDiv = document.createElement("div")
    methodDiv.className = "metodo-pago"

    if (method.type === "transferencia") {
      methodDiv.innerHTML = `
        <label class="registro__metodo-pago">
          <input type="radio" name="payment-method" value="transferencia" onchange="showTransferData()">
          <img src="${method.image}" alt="${method.name}" style="width: 30px; height: 30px;">
          <span>${method.name}</span>
        </label>
        <div class="transferencia-info" id="transfer-info" style="display: none;">
          <p><strong>CBU:</strong> ${method.data.cbu}</p>
          <p><strong>Alias:</strong> ${method.data.alias}</p>
          <p><strong>Titular:</strong> ${method.data.titular}</p>
          <p><strong>CUIT:</strong> ${method.data.cuit}</p>
          <p><strong>Banco:</strong> ${method.data.banco}</p>
          <p><strong>Estado:</strong> <span id="transfer-status">Pendiente</span></p>
          <button type="button" class="btn" id="confirm-transfer" onclick="confirmTransferPayment()" style="display: none;">
            Ya realicé el pago
          </button>
        </div>
      `
    } else if (method.type === "cupon") {
      let optionsHTML = ""
      method.options.forEach((option) => {
        optionsHTML += `
          <label class="registro__metodo-pago">
            <input type="radio" name="coupon-type" value="${option.value}" onchange="generateCoupon('${option.value}')">
            <img src="${option.image}" alt="${option.name}" style="width: 60px; height: 30px;">
            <span>${option.name}</span>
          </label>
        `
      })

      methodDiv.innerHTML = `
        <label class="registro__metodo-pago">
          <input type="radio" name="payment-method" value="cupon" onchange="showCouponOptions()">
          <img src="${method.image}" alt="${method.name}" style="width: 30px; height: 30px;">
          <span>${method.name}</span>
        </label>
        <div class="cupon-options" id="coupon-options" style="display: none;">
          <h5>Selecciona dónde pagar:</h5>
          ${optionsHTML}
          
          <div class="cupon-info" id="coupon-info" style="display: none;">
            <p><strong>Código de pago:</strong> <span id="coupon-code"></span></p>
            <p><strong>Lugar de pago:</strong> <span id="coupon-place"></span></p>
            <p><strong>Monto:</strong> $7.000,00</p>
            <p><strong>Vencimiento:</strong> <span id="coupon-expiry"></span></p>
            <p><strong>Estado:</strong> <span id="coupon-status">Pendiente</span></p>
            <button type="button" class="btn" id="confirm-coupon" onclick="confirmCouponPayment()" style="display: none;">
              Ya realicé el pago
            </button>
          </div>
        </div>
      `
    }

    container.appendChild(methodDiv)
  })
}

// Mostrar sección de datos de tarjeta
function showCardDataSection() {
  document.getElementById("card-data-section").style.display = "block"
  hideAlternativePayments()
}

// Ocultar métodos alternativos
function hideAlternativePayments() {
  document.getElementById("transfer-info").style.display = "none"
  document.getElementById("coupon-options").style.display = "none"
  document.getElementById("coupon-info").style.display = "none"
}

// Mostrar datos de transferencia
function showTransferData() {
  document.getElementById("transfer-info").style.display = "block"
  document.getElementById("confirm-transfer").style.display = "block"
  document.getElementById("card-data-section").style.display = "none"
  document.getElementById("coupon-options").style.display = "none"

  // Desmarcar tarjetas
  document.querySelectorAll('input[name="tarjeta"]').forEach((input) => {
    input.checked = false
  })
}

// Mostrar opciones de cupón
function showCouponOptions() {
  document.getElementById("coupon-options").style.display = "block"
  document.getElementById("card-data-section").style.display = "none"
  document.getElementById("transfer-info").style.display = "none"

  // Desmarcar tarjetas
  document.querySelectorAll('input[name="tarjeta"]').forEach((input) => {
    input.checked = false
  })
}

// Generar cupón de pago
function generateCoupon(type) {
  const couponCode = generateCouponCode()
  const expiryDate = new Date()
  expiryDate.setDate(expiryDate.getDate() + 7) // 7 días de vencimiento

  document.getElementById("coupon-code").textContent = couponCode
  document.getElementById("coupon-place").textContent = type === "pagofacil" ? "Pago Fácil" : "Rapipago"
  document.getElementById("coupon-expiry").textContent = expiryDate.toLocaleDateString()
  document.getElementById("coupon-info").style.display = "block"
  document.getElementById("confirm-coupon").style.display = "block"
}

// Generar código de cupón
function generateCouponCode() {
  const prefix = "CP"
  const randomNumber = Math.floor(Math.random() * 900000) + 100000
  return `${prefix}-${randomNumber}`
}

// Confirmar pago por transferencia
function confirmTransferPayment() {
  document.getElementById("transfer-status").textContent = "Pagado"
  document.getElementById("confirm-transfer").style.display = "none"
  alert("¡Pago por transferencia confirmado! Tu suscripción está activa.")
}

// Confirmar pago por cupón
function confirmCouponPayment() {
  document.getElementById("coupon-status").textContent = "Pagado"
  document.getElementById("confirm-coupon").style.display = "none"
  alert("¡Pago por cupón confirmado! Tu suscripción está activa.")
}

function loadUserData() {
  document.getElementById("user-name").textContent = `${currentUser.nombre} ${currentUser.apellido}`
  document.getElementById("user-email").textContent = `E-mail: ${currentUser.email}`
  document.getElementById("user-usuario").textContent = `Usuario: ${currentUser.usuario}`

  // Cargar plan actual
  document.getElementById("current-plan").textContent =
    currentUser.plan.charAt(0).toUpperCase() + currentUser.plan.slice(1)

  // Cargar método de pago actual
  if (currentUser.paymentMethod) {
    const method = currentUser.paymentMethod
    let paymentText = ""

    if (method.type === "tarjeta") {
      paymentText = `Tarjeta ${method.cardType} que termina en ${method.numero.slice(-4)}`
    } else if (method.type === "transferencia") {
      paymentText = `Transferencia bancaria - Estado: ${method.status || "Pendiente"}`
    } else if (method.type === "cupon") {
      paymentText = `Cupón de pago ${method.couponType} - Estado: ${method.status || "Pendiente"}`
    }

    document.getElementById("current-card").textContent = paymentText
  }

  // Seleccionar plan actual
  const currentPlanInput = document.querySelector(`input[name="plan"][value="${currentUser.plan}"]`)
  if (currentPlanInput) {
    currentPlanInput.checked = true
  }

  // Cargar datos de tarjeta si existe
  if (currentUser.paymentMethod && currentUser.paymentMethod.type === "tarjeta") {
    const method = currentUser.paymentMethod
    const cardInput = document.querySelector(`input[name="tarjeta"][value="${method.cardType}"]`)
    if (cardInput) {
      cardInput.checked = true
      showCardDataSection()
    }

    document.getElementById("numeroTarjeta").value = method.numero || ""
    document.getElementById("vencimiento").value = method.vencimiento || ""
    document.getElementById("cvv").value = method.cvv || ""
    document.getElementById("nombreTarjeta").value = method.nombre || ""
  }
}

function loadFavorites() {
  const allMovies = [
    // PELÍCULAS EXISTENTES ACTUALIZADAS
    {
      id: 2,
      title: "Misión Imposible",
      type: "pelicula",
      category: "accion",
      image: "../img/peliculas/mision-imposible.jpg",
    },
    {
      id: 4,
      title: "The Truman Show",
      type: "pelicula",
      category: "drama",
      image: "../img/peliculas/the-truman-show.jpg",
    },
    {
      id: 6,
      title: "Django Unchained",
      type: "pelicula",
      category: "western",
      image: "../img/peliculas/django-unchained.jpg",
    },
    {
      id: 8,
      title: "Minecraft The Movie",
      type: "pelicula",
      category: "aventura",
      image: "../img/peliculas/minecraft-the-movie.jpg",
    },

    // SERIES EXISTENTES ACTUALIZADAS
    {
      id: 1,
      title: "El Eternauta",
      type: "serie",
      category: "drama",
      image: "../img/peliculas/eleternauta1280x720.jpg",
    },
    { id: 3, title: "Friends", type: "serie", category: "comedia", image: "../img/peliculas/friends.jpg" },
    {
      id: 5,
      title: "The Walking Dead",
      type: "serie",
      category: "terror",
      image: "../img/peliculas/the-walking-dead.jpg",
    },
    {
      id: 7,
      title: "Las Cuatro Estaciones",
      type: "serie",
      category: "drama",
      image: "../img/peliculas/las-cuatro-estaciones.jpg",
    },
    { id: 9, title: "Rick y Morty", type: "serie", category: "comedia", image: "../img/peliculas/rick-y-morty.jpg" },
    {
      id: 10,
      title: "You Temporada 5",
      type: "serie",
      category: "terror",
      image: "../img/peliculas/you-temporada-5.jpg",
    },

    // NUEVAS PELÍCULAS
    {
      id: 11,
      title: "El Padrino",
      type: "pelicula",
      category: "drama",
      image:
        "https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg",
    },
    {
      id: 12,
      title: "Pulp Fiction",
      type: "pelicula",
      category: "drama",
      image:
        "https://m.media-amazon.com/images/M/MV5BNGNhMDIzZTUtNTBlZi00MTRlLWFjM2ItYzViMjE3YzI5MjljXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg",
    },
    {
      id: 13,
      title: "El Señor de los Anillos",
      type: "pelicula",
      category: "aventura",
      image:
        "https://m.media-amazon.com/images/M/MV5BN2EyZjM3NzUtNWUzMi00MTgxLWI0NTctMzY4M2VlOTdjZWRiXkEyXkFqcGdeQXVyNDUzOTQ5MjY@._V1_.jpg",
    },
    {
      id: 14,
      title: "Forrest Gump",
      type: "pelicula",
      category: "drama",
      image:
        "https://m.media-amazon.com/images/M/MV5BNWIwODRlZTUtY2U3ZS00Yzg1LWJhNzYtMmZiYmEyNmU1NjMzXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_.jpg",
    },
    {
      id: 15,
      title: "Matrix",
      type: "pelicula",
      category: "ciencia-ficcion",
      image:
        "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_.jpg",
    },
    {
      id: 16,
      title: "Gladiador",
      type: "pelicula",
      category: "accion",
      image:
        "https://m.media-amazon.com/images/M/MV5BMDliMmNhNDEtODUyOS00MjNlLTgxODEtN2U3NzIxMGVkZTA1L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_.jpg",
    },
    {
      id: 17,
      title: "Titanic",
      type: "pelicula",
      category: "drama",
      image:
        "https://m.media-amazon.com/images/M/MV5BMDdmZGU3NDQtY2E5My00ZTliLWIzOTUtMTY4ZGI1YjdiNjk3XkEyXkFqcGdeQXVyNTA4NzY1MzY@._V1_.jpg",
    },
    {
      id: 18,
      title: "El Caballero de la Noche",
      type: "pelicula",
      category: "accion",
      image: "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_.jpg",
    },
    {
      id: 19,
      title: "Interestelar",
      type: "pelicula",
      category: "ciencia-ficcion",
      image:
        "https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg",
    },
    {
      id: 20,
      title: "Parásitos",
      type: "pelicula",
      category: "thriller",
      image:
        "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_.jpg",
    },

    // NUEVAS SERIES
    {
      id: 21,
      title: "Breaking Bad",
      type: "serie",
      category: "drama",
      image:
        "https://m.media-amazon.com/images/M/MV5BYmQ4YWMxYjUtNjZmYi00MDQ1LWFjMjMtNjA5ZDdiYjdiODU5XkEyXkFqcGdeQXVyMTMzNDExODE5._V1_.jpg",
    },
    {
      id: 22,
      title: "Game of Thrones",
      type: "serie",
      category: "aventura",
      image:
        "https://m.media-amazon.com/images/M/MV5BYTRiNDQwYzAtMzVlZS00NTI5LWJjYjUtMzkwNTUzMWMxZTllXkEyXkFqcGdeQXVyNDIzMzcwNjc@._V1_.jpg",
    },
    {
      id: 23,
      title: "Stranger Things",
      type: "serie",
      category: "ciencia-ficcion",
      image:
        "https://m.media-amazon.com/images/M/MV5BN2ZmYjg1YmItNWQ4OC00YWM0LWE0ZDktYThjOTZiZjhhN2Q2XkEyXkFqcGdeQXVyNjgxNTQ3Mjk@._V1_.jpg",
    },
    {
      id: 24,
      title: "The Crown",
      type: "serie",
      category: "drama",
      image:
        "https://m.media-amazon.com/images/M/MV5BZmY0MzBlNjctYjc4Ny00ODBmLTg4NWEtNjY2ZmZhYzEyN2RmXkEyXkFqcGdeQXVyNTI4MzE4MDU@._V1_.jpg",
    },
    {
      id: 25,
      title: "The Office",
      type: "serie",
      category: "comedia",
      image:
        "https://m.media-amazon.com/images/M/MV5BMDNkOTE4NDQtMTNmYi00MWE0LWE4ZTktYTc0NzhhNWIzNzJiXkEyXkFqcGdeQXVyMzQ2MDI5NjU@._V1_.jpg",
    },
    {
      id: 26,
      title: "The Mandalorian",
      type: "serie",
      category: "ciencia-ficcion",
      image:
        "https://m.media-amazon.com/images/M/MV5BN2M5YWFjN2YtYzU2YS00NzBlLTgwZWUtYWQzNWFhNDkyYjg3XkEyXkFqcGdeQXVyMDM2NDM2MQ@@._V1_.jpg",
    },
    {
      id: 27,
      title: "Sherlock",
      type: "serie",
      category: "drama",
      image:
        "https://m.media-amazon.com/images/M/MV5BMWY3NTljMjEtYzRiMi00NWM2LTkzNjItZTVmZjE0MTdjMjJhL2ltYWdlL2ltYWdlXkEyXkFqcGdeQXVyNTQ4NTc5OTU@._V1_.jpg",
    },
    {
      id: 28,
      title: "The Witcher",
      type: "serie",
      category: "aventura",
      image:
        "https://m.media-amazon.com/images/M/MV5BN2FiOWU4YzYtMzZiOS00MzcyLTlkOGEtOTgwZmEwMzAxMzA3XkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_.jpg",
    },
  ]
  const favorites = JSON.parse(localStorage.getItem("favorites") || "{}")
  const userFavorites = favorites[currentUser.email] || []

  const favoriteMovies = allMovies.filter((movie) => userFavorites.includes(movie.id) && movie.type === "pelicula")
  const favoriteSeries = allMovies.filter((movie) => userFavorites.includes(movie.id) && movie.type === "serie")

  // Cargar películas favoritas
  const moviesGrid = document.getElementById("favorite-movies")
  moviesGrid.innerHTML = ""

  if (favoriteMovies.length === 0) {
    moviesGrid.innerHTML = "<p>No tenés películas favoritas</p>"
  } else {
    favoriteMovies.forEach((movie) => {
      const movieElement = document.createElement("div")
      movieElement.className = "favorito-item"
      movieElement.innerHTML = `
        <a href="detalle-pelicula.html">
          <img src="${movie.image}" alt="${movie.title}">
        </a>
        <span class="favorite-heart active" onclick="removeFromFavorites(${movie.id})">♥</span>
        <p>${movie.title}</p>
      `
      moviesGrid.appendChild(movieElement)
    })
  }

  // Cargar series favoritas
  const seriesGrid = document.getElementById("favorite-series")
  seriesGrid.innerHTML = ""

  if (favoriteSeries.length === 0) {
    seriesGrid.innerHTML = "<p>No tenés series favoritas</p>"
  } else {
    favoriteSeries.forEach((movie) => {
      const movieElement = document.createElement("div")
      movieElement.className = "favorito-item"
      movieElement.innerHTML = `
        <a href="detalle-serie.html">
          <img src="${movie.image}" alt="${movie.title}">
        </a>
        <span class="favorite-heart active" onclick="removeFromFavorites(${movie.id})">♥</span>
        <p>${movie.title}</p>
      `
      seriesGrid.appendChild(movieElement)
    })
  }
}

function removeFromFavorites(movieId) {
  const allMovies = [
    // PELÍCULAS EXISTENTES ACTUALIZADAS
    {
      id: 2,
      title: "Misión Imposible",
      type: "pelicula",
      category: "accion",
      image: "../img/peliculas/mision-imposible.jpg",
    },
    {
      id: 4,
      title: "The Truman Show",
      type: "pelicula",
      category: "drama",
      image: "../img/peliculas/the-truman-show.jpg",
    },
    {
      id: 6,
      title: "Django Unchained",
      type: "pelicula",
      category: "western",
      image: "../img/peliculas/django-unchained.jpg",
    },
    {
      id: 8,
      title: "Minecraft The Movie",
      type: "pelicula",
      category: "aventura",
      image: "../img/peliculas/minecraft-the-movie.jpg",
    },

    // SERIES EXISTENTES ACTUALIZADAS
    {
      id: 1,
      title: "El Eternauta",
      type: "serie",
      category: "drama",
      image: "../img/peliculas/eleternauta1280x720.jpg",
    },
    { id: 3, title: "Friends", type: "serie", category: "comedia", image: "../img/peliculas/friends.jpg" },
    {
      id: 5,
      title: "The Walking Dead",
      type: "serie",
      category: "terror",
      image: "../img/peliculas/the-walking-dead.jpg",
    },
    {
      id: 7,
      title: "Las Cuatro Estaciones",
      type: "serie",
      category: "drama",
      image: "../img/peliculas/las-cuatro-estaciones.jpg",
    },
    { id: 9, title: "Rick y Morty", type: "serie", category: "comedia", image: "../img/peliculas/rick-y-morty.jpg" },
    {
      id: 10,
      title: "You Temporada 5",
      type: "serie",
      category: "terror",
      image: "../img/peliculas/you-temporada-5.jpg",
    },

    // NUEVAS PELÍCULAS
    {
      id: 11,
      title: "El Padrino",
      type: "pelicula",
      category: "drama",
      image:
        "https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg",
    },
    {
      id: 12,
      title: "Pulp Fiction",
      type: "pelicula",
      category: "drama",
      image:
        "https://m.media-amazon.com/images/M/MV5BNGNhMDIzZTUtNTBlZi00MTRlLWFjM2ItYzViMjE3YzI5MjljXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg",
    },
    {
      id: 13,
      title: "El Señor de los Anillos",
      type: "pelicula",
      category: "aventura",
      image:
        "https://m.media-amazon.com/images/M/MV5BN2EyZjM3NzUtNWUzMi00MTgxLWI0NTctMzY4M2VlOTdjZWRiXkEyXkFqcGdeQXVyNDUzOTQ5MjY@._V1_.jpg",
    },
    {
      id: 14,
      title: "Forrest Gump",
      type: "pelicula",
      category: "drama",
      image:
        "https://m.media-amazon.com/images/M/MV5BNWIwODRlZTUtY2U3ZS00Yzg1LWJhNzYtMmZiYmEyNmU1NjMzXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_.jpg",
    },
    {
      id: 15,
      title: "Matrix",
      type: "pelicula",
      category: "ciencia-ficcion",
      image:
        "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_.jpg",
    },
    {
      id: 16,
      title: "Gladiador",
      type: "pelicula",
      category: "accion",
      image:
        "https://m.media-amazon.com/images/M/MV5BMDliMmNhNDEtODUyOS00MjNlLTgxODEtN2U3NzIxMGVkZTA1L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_.jpg",
    },
    {
      id: 17,
      title: "Titanic",
      type: "pelicula",
      category: "drama",
      image:
        "https://m.media-amazon.com/images/M/MV5BMDdmZGU3NDQtY2E5My00ZTliLWIzOTUtMTY4ZGI1YjdiNjk3XkEyXkFqcGdeQXVyNTA4NzY1MzY@._V1_.jpg",
    },
    {
      id: 18,
      title: "El Caballero de la Noche",
      type: "pelicula",
      category: "accion",
      image: "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_.jpg",
    },
    {
      id: 19,
      title: "Interestelar",
      type: "pelicula",
      category: "ciencia-ficcion",
      image:
        "https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg",
    },
    {
      id: 20,
      title: "Parásitos",
      type: "pelicula",
      category: "thriller",
      image:
        "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_.jpg",
    },

    // NUEVAS SERIES
    {
      id: 21,
      title: "Breaking Bad",
      type: "serie",
      category: "drama",
      image:
        "https://m.media-amazon.com/images/M/MV5BYmQ4YWMxYjUtNjZmYi00MDQ1LWFjMjMtNjA5ZDdiYjdiODU5XkEyXkFqcGdeQXVyMTMzNDExODE5._V1_.jpg",
    },
    {
      id: 22,
      title: "Game of Thrones",
      type: "serie",
      category: "aventura",
      image:
        "https://m.media-amazon.com/images/M/MV5BYTRiNDQwYzAtMzVlZS00NTI5LWJjYjUtMzkwNTUzMWMxZTllXkEyXkFqcGdeQXVyNDIzMzcwNjc@._V1_.jpg",
    },
    {
      id: 23,
      title: "Stranger Things",
      type: "serie",
      category: "ciencia-ficcion",
      image:
        "https://m.media-amazon.com/images/M/MV5BN2ZmYjg1YmItNWQ4OC00YWM0LWE0ZDktYThjOTZiZjhhN2Q2XkEyXkFqcGdeQXVyNjgxNTQ3Mjk@._V1_.jpg",
    },
    {
      id: 24,
      title: "The Crown",
      type: "serie",
      category: "drama",
      image:
        "https://m.media-amazon.com/images/M/MV5BZmY0MzBlNjctYjc4Ny00ODBmLTg4NWEtNjY2ZmZhYzEyN2RmXkEyXkFqcGdeQXVyNTI4MzE4MDU@._V1_.jpg",
    },
    {
      id: 25,
      title: "The Office",
      type: "serie",
      category: "comedia",
      image:
        "https://m.media-amazon.com/images/M/MV5BMDNkOTE4NDQtMTNmYi00MWE0LWE4ZTktYTc0NzhhNWIzNzJiXkEyXkFqcGdeQXVyMzQ2MDI5NjU@._V1_.jpg",
    },
    {
      id: 26,
      title: "The Mandalorian",
      type: "serie",
      category: "ciencia-ficcion",
      image:
        "https://m.media-amazon.com/images/M/MV5BN2M5YWFjN2YtYzU2YS00NzBlLTgwZWUtYWQzNWFhNDkyYjg3XkEyXkFqcGdeQXVyMDM2NDM2MQ@@._V1_.jpg",
    },
    {
      id: 27,
      title: "Sherlock",
      type: "serie",
      category: "drama",
      image:
        "https://m.media-amazon.com/images/M/MV5BMWY3NTljMjEtYzRiMi00NWM2LTkzNjItZTVmZjE0MTdjMjJhL2ltYWdlL2ltYWdlXkEyXkFqcGdeQXVyNTQ4NTc5OTU@._V1_.jpg",
    },
    {
      id: 28,
      title: "The Witcher",
      type: "serie",
      category: "aventura",
      image:
        "https://m.media-amazon.com/images/M/MV5BN2FiOWU4YzYtMzZiOS00MzcyLTlkOGEtOTgwZmEwMzAxMzA3XkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_.jpg",
    },
  ]
  const favorites = JSON.parse(localStorage.getItem("favorites") || "{}")
  let userFavorites = favorites[currentUser.email] || []

  userFavorites = userFavorites.filter((id) => id !== movieId)
  favorites[currentUser.email] = userFavorites
  localStorage.setItem("favorites", JSON.stringify(favorites))

  loadFavorites()
  alert("Eliminado de favoritos")
}

function setupEventListeners() {
  // Formulario de perfil
  document.getElementById("perfil-form").addEventListener("submit", (e) => {
    e.preventDefault()
    updatePassword()
  })

  // Formulario de plan
  document.getElementById("plan-form").addEventListener("submit", (e) => {
    e.preventDefault()
    updatePlanAndPayment()
  })

  // Validación de contraseña en tiempo real
  document.getElementById("nuevaPassword").addEventListener("input", validatePassword)
  document.getElementById("confirmarPassword").addEventListener("input", validatePassword)
}

function validatePassword() {
  const password = document.getElementById("nuevaPassword").value
  const confirmPassword = document.getElementById("confirmarPassword").value
  const passwordError = document.getElementById("password-error")
  const confirmarError = document.getElementById("confirmar-error")

  // Validar contraseña
  if (password && !isValidPassword(password)) {
    passwordError.textContent =
      "La contraseña debe tener mínimo 8 caracteres, 2 letras, 2 números y 2 caracteres especiales"
    passwordError.classList.remove("hidden")
  } else {
    passwordError.classList.add("hidden")
  }

  // Validar confirmación
  if (confirmPassword && password !== confirmPassword) {
    confirmarError.textContent = "Las contraseñas no coinciden"
    confirmarError.classList.remove("hidden")
  } else {
    confirmarError.classList.add("hidden")
  }
}

function isValidPassword(password) {
  const hasLetters = (password.match(/[a-zA-Z]/g) || []).length >= 2
  const hasNumbers = (password.match(/[0-9]/g) || []).length >= 2
  const hasSpecialChars = (password.match(/[^a-zA-Z0-9]/g) || []).length >= 2
  return password.length >= 8 && hasLetters && hasNumbers && hasSpecialChars
}

function updatePassword() {
  const newPassword = document.getElementById("nuevaPassword").value
  const confirmPassword = document.getElementById("confirmarPassword").value

  if (!newPassword) {
    alert("No hay cambios para guardar")
    return
  }

  if (!isValidPassword(newPassword)) {
    alert("La contraseña no cumple con los requisitos")
    return
  }

  if (newPassword !== confirmPassword) {
    alert("Las contraseñas no coinciden")
    return
  }

  // Actualizar usuario
  const users = JSON.parse(localStorage.getItem("registeredUsers") || "[]")
  const userIndex = users.findIndex((u) => u.email === currentUser.email)

  if (userIndex !== -1) {
    users[userIndex].password = newPassword
    localStorage.setItem("registeredUsers", JSON.stringify(users))
    localStorage.setItem("currentUser", JSON.stringify(users[userIndex]))
    currentUser = users[userIndex]

    alert("Contraseña actualizada exitosamente")
    document.getElementById("nuevaPassword").value = ""
    document.getElementById("confirmarPassword").value = ""
  }
}

function updatePlanAndPayment() {
  const selectedPlan = document.querySelector('input[name="plan"]:checked')
  const selectedCard = document.querySelector('input[name="tarjeta"]:checked')
  const selectedPaymentMethod = document.querySelector('input[name="payment-method"]:checked')

  const users = JSON.parse(localStorage.getItem("registeredUsers") || "[]")
  const userIndex = users.findIndex((u) => u.email === currentUser.email)

  if (userIndex === -1) return

  let updated = false

  // Actualizar plan
  if (selectedPlan && selectedPlan.value !== currentUser.plan) {
    users[userIndex].plan = selectedPlan.value
    updated = true
  }

  // Actualizar método de pago
  if (selectedCard) {
    // Método de pago con tarjeta
    const numeroTarjeta = document.getElementById("numeroTarjeta").value
    if (numeroTarjeta && validateCard(numeroTarjeta)) {
      const cvv = document.getElementById("cvv").value
      if (validateCVV(cvv)) {
        users[userIndex].paymentMethod = {
          type: "tarjeta",
          cardType: selectedCard.value,
          numero: numeroTarjeta,
          vencimiento: document.getElementById("vencimiento").value,
          cvv: cvv,
          nombre: document.getElementById("nombreTarjeta").value,
        }
        updated = true
      } else {
        alert("CVV inválido")
        return
      }
    } else if (numeroTarjeta) {
      alert("Número de tarjeta inválido")
      return
    }
  } else if (selectedPaymentMethod) {
    // Métodos de pago alternativos
    if (selectedPaymentMethod.value === "transferencia") {
      const transferStatus = document.getElementById("transfer-status").textContent
      users[userIndex].paymentMethod = {
        type: "transferencia",
        status: transferStatus,
        cbu: "0170329940000012345678",
        alias: "CILA.MOVIES.PAGO",
      }
      updated = true
    } else if (selectedPaymentMethod.value === "cupon") {
      const selectedCouponType = document.querySelector('input[name="coupon-type"]:checked')
      if (selectedCouponType) {
        const couponStatus = document.getElementById("coupon-status").textContent
        const couponCode = document.getElementById("coupon-code").textContent
        users[userIndex].paymentMethod = {
          type: "cupon",
          couponType: selectedCouponType.value,
          couponCode: couponCode,
          status: couponStatus,
        }
        updated = true
      }
    }
  }

  if (updated) {
    localStorage.setItem("registeredUsers", JSON.stringify(users))
    localStorage.setItem("currentUser", JSON.stringify(users[userIndex]))
    currentUser = users[userIndex]
    loadUserData()
    alert("Cambios guardados exitosamente")
  } else {
    alert("No hay cambios para guardar")
  }
}

function validateCard(cardNumber) {
  if (!/^\d{16}$/.test(cardNumber)) return false

  const digits = cardNumber.split("").map(Number)
  const lastDigit = digits[15]
  const sumWithoutLast = digits.slice(0, 15).reduce((sum, digit) => sum + digit, 0)

  return (sumWithoutLast % 2 === 0 && lastDigit % 2 === 1) || (sumWithoutLast % 2 === 1 && lastDigit % 2 === 0)
}

function validateCVV(cvv) {
  return /^\d{3}$/.test(cvv) && cvv !== "000"
}

function toggleTarjetaSection() {
  const section = document.getElementById("tarjeta-section")
  section.classList.toggle("active")
}

function cancelSubscription() {
  if (confirm("¿Estás seguro de que querés cancelar tu suscripción?")) {
    // Eliminar usuario
    const users = JSON.parse(localStorage.getItem("registeredUsers") || "[]")
    const filteredUsers = users.filter((u) => u.email !== currentUser.email)
    localStorage.setItem("registeredUsers", JSON.stringify(filteredUsers))

    // Eliminar favoritos
    const favorites = JSON.parse(localStorage.getItem("favorites") || "{}")
    delete favorites[currentUser.email]
    localStorage.setItem("favorites", JSON.stringify(favorites))

    // Cerrar sesión
    localStorage.removeItem("currentUser")
    window.location.href = "cancelacion.html"
  }
}

function logout() {
  localStorage.removeItem("currentUser")
  window.location.href = "../index.html"
}
