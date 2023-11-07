export const validatePassword = (password) => {
  let error = null;

  switch (true) {
    case password.length < 8:
      error = "!Contraseña Invalida! Minimo 8 Caracteres";
      break;
    case password.length > 30:
      error = "!Contraseña Invalida! Maximo 30 Caracteres";
      break;
    case !/[A-Z]/.test(password):
      error = "!Contraseña Invalida! Incluye una Mayuscula";
      break;
    case !/[a-z]/.test(password):
      error = "!Contraseña Invalida! Incluye una Minuscula";
      break;
    case !/\d/.test(password):
      error = "!Contraseña Invalida! Incluye un Numero";
      break;
    case !/[@#$%^&*!]/.test(password):
      error = "!Contraseña Invalida! Incluye un Simbolo";
      break;
    case password === 'Passw0rd' || password === 'Password123':
      error = "!Contraseña Invalida!";
      break;
  }

  if (error) {
    console.log(error);
    return error;
  }

  return null;
};
