import { FaHeart, FaStethoscope, FaClock } from "react-icons/fa";
import type { IconType } from "react-icons";

export type ServiceItem = {
  title: string;
  description: string;
  icon: IconType;
};

export const services: ServiceItem[] = [
  {
    title: "Preventiva",
    description:
      "Chequeos, vacunas y seguimiento para que cada etapa sea saludable.",
    icon: FaHeart,
  },
  {
    title: "Especialidades",
    description:
      "Atención médica integral con diagnóstico y tratamientos personalizados.",
    icon: FaStethoscope,
  },
  {
    title: "Flexibilidad",
    description:
      "Citas ágiles, seguimiento telefónico y acompañamiento en casa.",
    icon: FaClock,
  },
];

export const scheduleItems = [
  "Lunes a viernes: 8:00 - 20:00",
  "Sábados: 9:00 - 14:00",
  "Urgencias: atención prioritaria",
];

export const teamCopy = {
  eyebrow: "Equipo",
  title: "Cuidamos con experiencia, empatía y tecnología.",
  description:
    "Nuestro equipo combina medicina veterinaria, seguimiento cercano y protocolos de bienestar para que cada visita sea tranquila.",
};

export const servicesCopy = {
  eyebrow: "Servicios",
  title: "Una clínica pensada para fortalecer el vínculo con tu mascota.",
};

export const siteInfo = {
  name: "Luma Vet",
  address: "Av. Central 123",
  email: "contacto@lumavet.com",
  phone: "+34 600 123 456",
};