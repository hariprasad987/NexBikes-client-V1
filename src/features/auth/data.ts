export type AuthSlide = {
  alt: string;
  description: string;
  image: string;
  title: string;
};

export const AUTH_SLIDE_INTERVAL_MS = 3_000;

export const authSlides = [
  {
    alt: "Cyclist riding through misty moorland",
    description: "Know your bike before it lets you down.",
    image: "/images/auth/cyclist-moorland.png",
    title: "BIKE HEALTH OVERVIEW",
  },
  {
    alt: "Mountain biker riding across a red-rock ridge",
    description: "Find the right part at the best price",
    image: "/images/auth/cyclist-ridge.png",
    title: "COMPATIBLE PARTS",
  },
  {
    alt: "Cyclist inspecting a mountain bike wheel",
    description: "Stay ahead of costly repairs",
    image: "/images/auth/bike-maintenance.png",
    title: "PREDICTIVE MAINTENANCE",
  },
] satisfies readonly [AuthSlide, AuthSlide, AuthSlide];
