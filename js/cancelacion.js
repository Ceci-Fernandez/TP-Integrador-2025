document.addEventListener("DOMContentLoaded", () => {
   
    const urlParams = new URLSearchParams(window.location.search);
    const userName = urlParams.get('name');
    
    
    const mensaje = document.getElementById("cancelacion-mensaje");
    if (userName) {
        mensaje.textContent = `Cancelaste tu suscripción. Lamentamos que te vayas, ${userName} 😢`;
    }
});