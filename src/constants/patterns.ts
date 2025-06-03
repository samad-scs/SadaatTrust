export const pattern = {
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
  passwordPattern: /^(?=.*?[A-Z])(?=(.*[a-z]){1,})(?=(.*[\d]){1,})(?=(.*[\W]){1,})(?!.*\s).{8,}$/,
  alphaAllowed: /^[A-Z a-z]+$/i,
  panCardAllowed: /^[A-Za-z]{5}\d{4}[A-Za-z]{1}$/,
  numbersAllowed: /^[0-9]+$/i,
  urlPattern: /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi
}
