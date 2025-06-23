// registro.js modificado para mostrar métodos de pago en columnas y ocultar detalles dinámicamente

const cardTypes = [
  { value: "naranja", name: "Tarjeta Naranja", image: "../img/img-tarjetas/naranja.png" },
  { value: "mastercard", name: "Mastercard", image: "../img/img-tarjetas/mastercard.png" },
  { value: "visa", name: "Visa", image: "../img/img-tarjetas/visa.png" },
  { value: "cabal", name: "Cabal", image: "../img/img-tarjetas/cabal.png" },
]

const alternativePayments = [
  {
    type: "transferencia",
    name: "Transferencia Bancaria",
    icon: "<i class='bi bi-bank2'></i>",
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
    icon: "<i class='bi bi-receipt'></i>",
    options: [
      { value: "pagofacil", name: "Pago Fácil" },
      { value: "rapipago", name: "Rapipago" },
    ],
  },
]

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registro-form")
  const registroBtn = document.getElementById("registro-btn")
  // ... campos y errores omitidos por brevedad ...

  generateDynamicCards()
  generateAlternativePayments()
})

function generateDynamicCards() {
  const cardsContainer = document.querySelector(".registro__tarjetas")
  cardsContainer.innerHTML = ""
  cardTypes.forEach((card) => {
    const cardElement = document.createElement("label")
    cardElement.className = "registro__tarjeta"
    cardElement.innerHTML = `
      <input type="radio" name="tarjeta" value="${card.value}" required>
      <img src="${card.image}" alt="${card.name}">
    `
    cardsContainer.appendChild(cardElement)
  })
}

function generateAlternativePayments() {
  const container = document.getElementById("alternative-payments")
  container.innerHTML = ""

  const row = document.createElement("div")
  row.className = "registro__metodos-row"

  alternativePayments.forEach((method) => {
    const methodDiv = document.createElement("div")
    methodDiv.className = "metodo-pago-columna"
    const contentId = `pago-${method.type}`

    let extraHTML = ""

    if (method.type === "cupon") {
      let optionsHTML = method.options.map(opt => `
        <label class="registro__metodo-pago">
          <input type="radio" name="coupon-type" value="${opt.value}" onchange="generateCoupon('${opt.value}')">
          <span>${opt.name}</span>
        </label>`).join("")

      extraHTML = `
        <div id="${contentId}" class="metodo-detalle" style="display: none">
          <h5>Selecciona dónde pagar:</h5>
          ${optionsHTML}
          <div class="cupon-info" id="coupon-info" style="display: none">
            <p><strong>Código de pago:</strong> <span id="coupon-code"></span></p>
            <p><strong>Lugar de pago:</strong> <span id="coupon-place"></span></p>
            <p><strong>Monto:</strong> $7.000,00</p>
            <p><strong>Vencimiento:</strong> <span id="coupon-expiry"></span></p>
            <p><strong>Estado:</strong> <span id="coupon-status">Pendiente</span></p>
            <button type="button" class="btn" id="confirm-coupon" onclick="confirmCouponPayment()">
              Ya realicé el pago
            </button>
          </div>
        </div>`
    } else if (method.type === "transferencia") {
      extraHTML = `
        <div id="${contentId}" class="metodo-detalle" style="display: none">
          <p><strong>CBU:</strong> ${method.data.cbu}</p>
          <p><strong>Alias:</strong> ${method.data.alias}</p>
          <p><strong>Titular:</strong> ${method.data.titular}</p>
          <p><strong>CUIT:</strong> ${method.data.cuit}</p>
          <p><strong>Banco:</strong> ${method.data.banco}</p>
        </div>`
    }

    methodDiv.innerHTML = `
      <div class="metodo-titulo">
        ${method.icon}<br>
        <span>${method.name}</span>
        <br>
        <input type="radio" name="payment-method" value="${method.type}" onclick="toggleMetodo('${contentId}')">
      </div>
      ${extraHTML}
    `
    row.appendChild(methodDiv)
  })

  container.appendChild(row)
}

function toggleMetodo(id) {
  document.querySelectorAll('.metodo-detalle').forEach(el => {
    if (el.id === id) {
      el.style.display = el.style.display === "none" ? "block" : "none"
    } else {
      el.style.display = "none"
    }
  })
}

function generateCoupon(type) {
  const couponCode = generateCouponCode()
  const expiryDate = new Date()
  expiryDate.setDate(expiryDate.getDate() + 7)

  document.getElementById("coupon-code").textContent = couponCode
  document.getElementById("coupon-place").textContent = type === "pagofacil" ? "Pago Fácil" : "Rapipago"
  document.getElementById("coupon-expiry").textContent = expiryDate.toLocaleDateString()
  document.getElementById("coupon-info").style.display = "block"
}

function generateCouponCode() {
  const prefix = "CP"
  const randomNumber = Math.floor(Math.random() * 900000) + 100000
  return `${prefix}-${randomNumber}`
}

function confirmCouponPayment() {
  document.getElementById("coupon-status").textContent = "Pagado"
  alert("¡Pago por cupón confirmado! Tu suscripción está activa.")
}
