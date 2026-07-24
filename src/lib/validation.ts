export function normalizePhone(phone: string): string {
  return phone.replace(/\s+/g, "").trim();
}



export function isValidPhone(phone: string): boolean {
  const normalizedPhone = normalizePhone(phone);

  /*
   * Aceita:
   * 912345678
   * 212345678
   * +351912345678
   * 00351912345678
   */
  const phoneRegex = /^(?:(?:\+|00)351)?(?:2\d{8}|9[1236]\d{7})$/;

  return phoneRegex.test(normalizedPhone);
}

export function normalizeName(name: string): string {
  return name.trim().replace(/\s+/g, " ");
}

export function normalizeRegistration(registration: string): string {
  return registration.toUpperCase().replace(/\s+/g, "").trim();
}

export function isValidRegistration(registration: string): boolean {
  const normalizedRegistration = normalizeRegistration(registration);

  /*
   * Aceita matrículas como:
   * 12-AB-34
   * AA-12-BB
   * 12-34-AB
   */
  const registrationRegex =
    /^(?:\d{2}-[A-Z]{2}-\d{2}|[A-Z]{2}-\d{2}-[A-Z]{2}|\d{2}-\d{2}-[A-Z]{2})$/;

  return registrationRegex.test(normalizedRegistration);
}