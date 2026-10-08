// Datos del responsable del servicio (los pide la ley: LGPD, Ley 1581, LFPDPPP y afines).
// Se completan UNA sola vez acá y se reflejan en Términos y Privacidad.
window.C2P_LEGAL = {
  titular: 'Andrea Valdez',
  pais: 'Argentina',
  contacto: ''
};

document.addEventListener('DOMContentLoaded', function () {
  var L = window.C2P_LEGAL;
  var textos = {
    titular: L.titular || 'el titular de Clip2Post',
    pais: L.pais || 'el país del titular',
    contacto: L.contacto || 'el soporte de tu compra en Hotmart'
  };
  document.querySelectorAll('[data-legal]').forEach(function (n) {
    var k = n.getAttribute('data-legal');
    if (k === 'contacto' && L.contacto) {
      var a = document.createElement('a');
      a.href = 'mailto:' + L.contacto; a.textContent = L.contacto;
      n.textContent = ''; n.appendChild(a);
    } else {
      n.textContent = textos[k];
    }
  });
});
