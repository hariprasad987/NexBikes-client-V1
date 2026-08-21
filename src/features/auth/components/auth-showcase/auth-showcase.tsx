"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import type { Swiper as SwiperInstance } from "swiper";
import { A11y, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";

import {
  AUTH_SLIDE_INTERVAL_MS,
  authSlides,
} from "@/features/auth/data";
import { fontClasses } from "@/styles/fonts";

import styles from "./auth-showcase.module.scss";

export function AuthShowcase() {
  const [activeSlide, setActiveSlide] = useState(0);
  const swiperRef = useRef<SwiperInstance | null>(null);
  const slide = authSlides[activeSlide];

  const selectSlide = (index: number) => {
    const swiper = swiperRef.current;

    if (!swiper) {
      return;
    }

    swiper.autoplay.stop();
    swiper.slideToLoop(index);
    swiper.autoplay.start();
  };

  return (
    <section
      aria-label="NexBikes features"
      aria-roledescription="carousel"
      className={styles.showcase}
    >
      <Swiper
        a11y={{
          enabled: true,
          itemRoleDescriptionMessage: "Feature slide",
          slideLabelMessage: "{{index}} of {{slidesLength}}",
        }}
        autoplay={{
          delay: AUTH_SLIDE_INTERVAL_MS,
          disableOnInteraction: false,
          pauseOnMouseEnter: false,
        }}
        allowTouchMove
        className={styles.slider}
        grabCursor
        loop
        modules={[A11y, Autoplay]}
        onRealIndexChange={(swiper) => setActiveSlide(swiper.realIndex)}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        slidesPerView={1}
        speed={400}
      >
        {authSlides.map((item, index) => (
          <SwiperSlide className={styles.slide} key={item.title}>
            <Image
              alt={index === activeSlide ? item.alt : ""}
              aria-hidden={index !== activeSlide}
              className={styles.image}
              fill
              priority={index === 0}
              sizes="(max-width: 1024px) 0px, 50vw"
              src={item.image}
            />
          </SwiperSlide>
        ))}
      </Swiper>
      <div
        className={`${styles.overlay} ${styles[`overlay${activeSlide + 1}`]}`}
      />
      <div
        aria-atomic="true"
        aria-live="off"
        className={styles.copy}
      >
        <p>{slide.description}</p>
        <h2 className={fontClasses.display}>{slide.title}</h2>
        <div aria-label="Choose a feature slide" className={styles.pagination} role="group">
          {authSlides.map((item, index) => (
            <button
              aria-label={`Show slide ${index + 1}: ${item.title}`}
              aria-pressed={index === activeSlide}
              className={`${styles.dot} ${index === activeSlide ? styles.activeDot : ""}`}
              key={item.title}
              onClick={() => selectSlide(index)}
              type="button"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
