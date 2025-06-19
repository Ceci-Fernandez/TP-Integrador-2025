document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form.registro");
  const nombre = document.getElementById("nombre_registro");
  const apellido = document.getElementById("apellido_registro");
  const email = document.getElementById("email_registro");
  const usuario = document.getElementById("usuario_registro");
  const password = document.getElementById("password_registro");
  const confirmar = document.getElementById("confirmar_registro");
  const numTarjeta = document.getElementById("num-tarjeta");
  const cvv = document.getElementById("cod");
  const nombreTarjeta = document.getElementById("nombre_tarjeta");
  const confirmarBtn = document.querySelector(".contenedor-btn__registro .btn[type='submit']");

   let contratacionDePlan=null;
   let bancoFinanciera = null;

  const mostrarError = (input, mensaje) => {
    let error = input.nextElementSibling;
    if (!error || !error.classList.contains("error")) {
      error = document.createElement("div");
      error.className = "error";
      error.style.color = "red";
      input.parentNode.insertBefore(error, input.nextSibling);
    }
    error.textContent = mensaje;
  };

  const limpiarError = (input) => {
    let error = input.nextElementSibling;
    if (error && error.classList.contains("error")) {
      error.remove();
    }
  };

  const soloLetras = /^[A-Za-zÁÉÍÓÚáéíóúñÑ ]+$/;
  const usuarioRegex = /^[A-Za-z0-9]+$/;
  const passwordRegex = /^(?=(?:.*[A-Za-z]){2,})(?=(?:.*\d){2,})(?=(?:.*[^A-Za-z\d]){2,}).{8,}$/;

  function validarCampo(input) {
    let valido = true;

    switch (input) {
      case nombre:
      case apellido:
        if (!soloLetras.test(input.value.trim())) {
          mostrarError(input, "Solo se permiten letras");
          valido = false;
        } else {
          limpiarError(input);
        }
        break;

      case email:
        if (!email.validity.valid) {
          mostrarError(email, "Email no válido");
          valido = false;
        } else {
          limpiarError(email);
        }
        break;

      case usuario:
        if (!usuarioRegex.test(usuario.value.trim())) {
          mostrarError(usuario, "Solo letras y números");
          valido = false;
        } else {
          limpiarError(usuario);
        }
        break;

      case password:
        if (!passwordRegex.test(password.value)) {
          mostrarError(password, "Min 8 caracteres, 2 letras, 2 números y 2 símbolos");
          valido = false;
        } else {
          limpiarError(password);
        }
        break;

      case confirmar:
        if (confirmar.value !== password.value) {
          mostrarError(confirmar, "Las contraseñas no coinciden");
          valido = false;
        } else {
          limpiarError(confirmar);
        }
        break;

      case numTarjeta:
        if (!/^\d{16}$/.test(numTarjeta.value)) {
          mostrarError(numTarjeta, "La tarjeta debe tener 16 dígitos");
          valido = false;
        } else {
          const numeros = numTarjeta.value.split('').map(Number);
          const suma = numeros.slice(0, 15).reduce((acc, n) => acc + n, 0);
          const ultimo = numeros[15];
          if ((suma % 2 === 0 && ultimo % 2 === 0) || (suma % 2 === 1 && ultimo % 2 === 1)) {
            mostrarError(numTarjeta, "El último número no cumple la condición par/impar");
            valido = false;
          } else {
            limpiarError(numTarjeta);
          }
        }
        break;

      case cvv:
        if (!/^[1-9]\d{2}$/.test(cvv.value)) {
          mostrarError(cvv, "CVV inválido. No puede ser 000");
          valido = false;
        } else {
          limpiarError(cvv);
        }
        break;

      case nombreTarjeta:
        if (nombreTarjeta.value.trim() === "") {
          mostrarError(nombreTarjeta, "Campo requerido");
          valido = false;
        } else {
          limpiarError(nombreTarjeta);
        }
        break;
    }

    return valido;
  }
  
// Aca se generan las opciones de tarjetas dinamicamente
    const tarjetas = ["cabal", "cabaldebit", "maestro", "mastercard", "naranja", "visa", "visadebit"];

  tarjetas.forEach(marca => {
    const img = document.createElement("img");
    img.src = `/img/img-tarjetas/${marca}.png`;
    img.style.cursor = "pointer";
    img.className = "img_tarjeta";


    img.addEventListener("click", () => {
    document.querySelectorAll(".img_tarjeta").forEach(t => t.classList.remove("seleccionada"));
    img.classList.add("seleccionada");

    bancoFinanciera = marca;

    });

    metodosPago.appendChild(img);
  });


// Aca es donde se generan los diferentes tipos de planes y se agregan dinamicamnete,
//  pensado en un modelo escalable o para modifcacion de precios.
  const planes = [
    { nombre: "Básico", precio: 3000 },
    { nombre: "Estándar", precio: 5000 },
    { nombre: "Premium", precio: 8000, popular: true }
  ];
   

  planes.forEach(plan => {
    const div = document.createElement("div");
    div.className = "registro__plan" + (plan.popular ? " plan-premium" : "");
    div.innerHTML = `
      <h4>${plan.nombre}</h4>
      <p>$${plan.precio}/mes</p>
      <input type="radio" name="plan" value="${plan.nombre}">
    `
    
     div.addEventListener("click", () => {
       document.querySelectorAll(".registro__plan").forEach(t => t.classList.remove("seleccionado"));
       div.classList.add("seleccionado");
        contratacionDePlan = plan.nombre;
    });
    planesContainer.appendChild(div);
     });

  [nombre, apellido, email, usuario, password, confirmar, numTarjeta, cvv, nombreTarjeta].forEach(input => {
    input.addEventListener("blur", () => {
      validarCampo(input);
    });
  });


  form.addEventListener("submit", (e) => {
    let valido = true;
    [nombre, apellido, email, usuario, password, confirmar, numTarjeta, cvv, nombreTarjeta].forEach(input => {
      if (!validarCampo(input)) {
        valido = false;
      }
    });

    confirmarBtn.disabled = !valido;

    if (!valido) {
    e.preventDefault();
  } else {
    const datosUsuario = {
    datosPersonales:{
      nombre: nombre.value.trim(),
      apellido: apellido.value.trim(),
      email: email.value.trim(),
      usuario: usuario.value.trim(),
      password: password.value
    },
    datosTarjeta:{
      numTarjeta: numTarjeta.value,
      cvv: cvv.value,
      nombreTarjeta: nombreTarjeta.value.trim(),
      tarjetaSeleccionada:bancoFinanciera
    },
    planContratado:contratacionDePlan||null
    };
  const usuarios= JSON.parse(localStorage.getItem("usuarioRegistrado"))||[];
   usuarios.push(datosUsuario);
    localStorage.setItem("usuarioRegistrado", JSON.stringify(usuarios));
  }
  });
});
