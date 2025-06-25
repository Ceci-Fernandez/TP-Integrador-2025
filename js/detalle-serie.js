const temporadas = {

  1 : 6,
  2 : 10,
  3 : 8,

}

document.addEventListener("DOMContentLoaded", () => {
  const temporadaSeleccionada= document.getElementById("temporada");
  const capituloSeleccionado= document.getElementById("capitulo");

  function cargarCapitulos(numeros_temporada) {
    capituloSeleccionado.innerHTML = "";
    for (let i = 1; i <= temporadas[numeros_temporada]; i++) {
      const option = document.createElement("option");
      option.value = i;
      option.textContent = `Capítulo ${i}`;
      capituloSeleccionado.appendChild(option);
    }
  }

  if(temporadaSeleccionada && capituloSeleccionado) {

  cargarCapitulos(temporadaSeleccionada.value);

  temporadaSeleccionada.addEventListener("change", (e) => {
        cargarCapitulos(e.target.value);
        });


  }

});

const carrusel = document.querySelector("carrusel");
const boton_izquierda = document.querySelector(".boton-izquierda");
const boton_derecha = document.querySelector(".boton-derecha");

if (carrusel && boton_izquierda && boton_derecha) {
  
  boton_izquierda.addEventListener("click", () => {
    carrusel.scrollBy({
      left: -carrusel.offsetWidth,
      behavior: "smooth"

    });
  });

  boton_derecha.addEventListener("click", () => {
    carrusel.scrollBy({
      left: carrusel.offsetWidth,
      behavior: "smooth"


    });
   
 
  });
}