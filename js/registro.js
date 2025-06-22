document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registro-form")
  const registroBtn = document.getElementById("registro-btn")

  const inputs = {
    nombre: document.getElementById("nombre"),
    apellido: document.getElementById("apellido"),
    email: document.getElementById("email"),
    usuario: document.getElementById("usuario"),
    password: document.getElementById("password"),
    confirmarPassword: document.getElementById("confirmarPassword"),
    numeroTarjeta: document.getElementById("numeroTarjeta"),
    cvv: document.getElementById("cvv"),
    nombreTarjeta: document.getElementById("nombreTarjeta"),
  }

  const errors = {
    nombre: document.getElementById("nombre-error"),
    apellido: document.getElementById("apellido-error"),
    email: document.getElementById("email-error"),
    usuario: document.getElementById("usuario-error"),
    password: document.getElementById("password-error"),
    confirmar: document.getElementById("confirmar-error"),
    tarjeta: document.getElementById("tarjeta-error"),
    cvv: document.getElementById("cvv-error"),
  }

  // Validaciones
  function validateName(name) {
    return /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(name)
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  function validateUser(user) {
    return /^[a-zA-Z0-9]+$/.test(user)
  }

  function validatePassword(password) {
    const hasLetters = (password.match(/[a-zA-Z]/g) || []).length >= 2
    const hasNumbers = (password.match(/[0-9]/g) || []).length >= 2
    const hasSpecialChars = (password.match(/[^a-zA-Z0-9]/g) || []).length >= 2
    return password.length >= 8 && hasLetters && hasNumbers && hasSpecialChars
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

  function showError(field, message) {
    errors[field].textContent = message
    errors[field].classList.remove("hidden")
  }

  function hideError(field) {
    errors[field].classList.add("hidden")
  }

  function validateForm() {
    let isValid = true

    // Validar nombre
    if (inputs.nombre.value && !validateName(inputs.nombre.value)) {
      showError("nombre", "El nombre solo puede contener letras")
      isValid = false
    } else {
      hideError("nombre")
    }

    // Validar apellido
    if (inputs.apellido.value && !validateName(inputs.apellido.value)) {
      showError("apellido", "El apellido solo puede contener letras")
      isValid = false
    } else {
      hideError("apellido")
    }

    // Validar email
    if (inputs.email.value && !validateEmail(inputs.email.value)) {
      showError("email", "Email inválido")
      isValid = false
    } else {
      hideError("email")
    }

    // Validar usuario
    if (inputs.usuario.value && !validateUser(inputs.usuario.value)) {
      showError("usuario", "El usuario solo puede contener letras y números")
      isValid = false
    } else {
      hideError("usuario")
    }

    // Validar contraseña
    if (inputs.password.value && !validatePassword(inputs.password.value)) {
      showError(
        "password",
        "La contraseña debe tener mínimo 8 caracteres, 2 letras, 2 números y 2 caracteres especiales",
      )
      isValid = false
    } else {
      hideError("password")
    }

    // Validar confirmación de contraseña
    if (inputs.confirmarPassword.value && inputs.password.value !== inputs.confirmarPassword.value) {
      showError("confirmar", "Las contraseñas no coinciden")
      isValid = false
    } else {
      hideError("confirmar")
    }

    // Validar tarjeta
    if (inputs.numeroTarjeta.value && !validateCard(inputs.numeroTarjeta.value)) {
      showError("tarjeta", "Número de tarjeta inválido")
      isValid = false
    } else {
      hideError("tarjeta")
    }

    // Validar CVV
    if (inputs.cvv.value && !validateCVV(inputs.cvv.value)) {
      showError("cvv", "CVV inválido (3 dígitos distintos de 000)")
      isValid = false
    } else {
      hideError("cvv")
    }

    // Verificar campos requeridos
    const requiredFields = [
      "nombre",
      "apellido",
      "email",
      "usuario",
      "password",
      "confirmarPassword",
      "numeroTarjeta",
      "cvv",
      "nombreTarjeta",
    ]
    const allFieldsFilled = requiredFields.every((field) => inputs[field].value.trim() !== "")

    // Verificar radio buttons
    const planSelected = document.querySelector('input[name="plan"]:checked')
    const tarjetaSelected = document.querySelector('input[name="tarjeta"]:checked')

    registroBtn.disabled = !(allFieldsFilled && planSelected && tarjetaSelected && isValid)
  }

  // Event listeners para validación en tiempo real
  Object.values(inputs).forEach((input) => {
    input.addEventListener("input", validateForm)
  })

  document.querySelectorAll('input[name="plan"], input[name="tarjeta"]').forEach((radio) => {
    radio.addEventListener("change", validateForm)
  })

  // Manejar envío del formulario
  form.addEventListener("submit", (e) => {
    e.preventDefault()

    if (registroBtn.disabled) return

    // Verificar si el email ya existe
    const users = JSON.parse(localStorage.getItem("registeredUsers") || "[]")
    if (users.some((user) => user.email === inputs.email.value)) {
      showError("email", "Este email ya está registrado")
      return
    }

    // Crear nuevo usuario
    const newUser = {
      nombre: inputs.nombre.value,
      apellido: inputs.apellido.value,
      email: inputs.email.value,
      usuario: inputs.usuario.value,
      password: inputs.password.value,
      plan: document.querySelector('input[name="plan"]:checked').value,
      tarjeta: {
        tipo: document.querySelector('input[name="tarjeta"]:checked').value,
        numero: inputs.numeroTarjeta.value,
        vencimiento: document.getElementById("vencimiento").value,
        cvv: inputs.cvv.value,
        nombre: inputs.nombreTarjeta.value,
      },
      fechaRegistro: new Date().toISOString(),
    }

    users.push(newUser)
    localStorage.setItem("registeredUsers", JSON.stringify(users))

    alert("Registro exitoso! Ahora podés iniciar sesión.")
    window.location.href = "login.html"
  })
})
