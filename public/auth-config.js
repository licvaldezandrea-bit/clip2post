// El código de 6 dígitos por correo requiere un servicio de correo propio (SMTP) en Supabase
// (con el correo por defecto, el mensaje trae solo el link). Cuando se configure el SMTP y la
// plantilla con {{ .Token }}, cambiar esto a true.
window.C2P_AUTH = { codigoPorCorreo: false };
