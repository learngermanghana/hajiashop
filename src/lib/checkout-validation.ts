export type CheckoutField = "name" | "email" | "phone" | "deliveryLocation";

export type CheckoutDetails = Record<CheckoutField, string>;

export type CheckoutValidationErrors = Partial<Record<CheckoutField, string>>;

const NAME_PART_PATTERN = /^[\p{L}][\p{L}'’-]*$/u;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/;

export function normalizeCheckoutText(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

export function normalizeGhanaPhone(value: string) {
  const digits = value.replace(/\D/g, "");

  if (digits.length === 10 && digits.startsWith("0")) return `233${digits.slice(1)}`;
  if (digits.length === 12 && digits.startsWith("233")) return digits;
  return digits;
}

export function validateCheckoutDetails(details: CheckoutDetails): CheckoutValidationErrors {
  const errors: CheckoutValidationErrors = {};
  const name = normalizeCheckoutText(details.name);
  const email = details.email.trim().toLowerCase();
  const phone = normalizeGhanaPhone(details.phone);
  const deliveryLocation = normalizeCheckoutText(details.deliveryLocation);
  const nameParts = name.split(" ").filter(Boolean);
  const hasImplausibleNamePart = nameParts.some((part) => {
    const letters = part.replace(/['’-]/g, "");
    return letters.length >= 6 && !/[aeiou]/i.test(letters);
  });

  if (name.length < 5 || name.length > 80 || nameParts.length < 2 || nameParts.some((part) => !NAME_PART_PATTERN.test(part)) || hasImplausibleNamePart) {
    errors.name = "Enter your first and last name using letters.";
  }

  if (email.length > 180 || !EMAIL_PATTERN.test(email) || email.includes("..")) {
    errors.email = "Enter a complete email address, for example name@example.com.";
  }

  if (!/^233[235]\d{8}$/.test(phone)) {
    errors.phone = "Enter a valid Ghana phone number, for example 024 000 0000.";
  }

  if (deliveryLocation.length < 8 || deliveryLocation.length > 300 || !/\p{L}/u.test(deliveryLocation)) {
    errors.deliveryLocation = "Enter a clear town, area, street, or nearby landmark.";
  }

  return errors;
}
