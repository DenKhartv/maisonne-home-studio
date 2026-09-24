import workLoft from "@/assets/portfolio-work-loft.jpg";
import workResidence from "@/assets/portfolio-work-residence.jpg";

export type PortfolioWork = {
  id: string;
  image: string;
  alt: string;
  title: string;
  meta: string;
};

export const portfolioWorks: PortfolioWork[] = [
  {
    id: "prechestinka",
    image: workLoft,
    alt: "Светлая гостиная с модульным диваном Форма",
    title: "Квартира на Пречистенке",
    meta: "Москва · 2026",
  },
  {
    id: "residence",
    image: workResidence,
    alt: "Гостиная с изогнутым диваном Форма",
    title: "Резиденция на озере",
    meta: "Санкт-Петербург · 2025",
  },
];
