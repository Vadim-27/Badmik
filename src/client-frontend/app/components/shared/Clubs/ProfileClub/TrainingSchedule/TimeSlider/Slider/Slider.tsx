

"use client";

import { FC, ReactNode, useEffect, useState } from "react";
import clsx from "clsx";
// import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";

import options from "@/app/components/configs/embla-slider";
import ArrowSliderLeft from "@/app/assets/icons/ArrowSliderLeft.svg";
import ArrowSliderRight from "@/app/assets/icons/ArrowSliderRight.svg";

import scss from "./Slider.module.scss";

interface ISlider {
  children: ReactNode;
  className?: string;
}

const Slider: FC<ISlider> = ({ children, className }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(options, [
    // Autoplay({
    //   playOnInit: true,
    //   delay: 5000,
    //   stopOnInteraction: false,
    //   stopOnMouseEnter: true,
    // }),
  ]);

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  // const [selectedIndex, setSelectedIndex] = useState(0);
  // const [slideCount, setSlideCount] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setCanScrollPrev(emblaApi.canScrollPrev());
      setCanScrollNext(emblaApi.canScrollNext());
      // setSelectedIndex(emblaApi.selectedScrollSnap());
    };

    // const updateSlideCount = () => {
    //   setSlideCount(emblaApi.slideNodes().length);
    // };

    emblaApi.on("select", onSelect);
    onSelect(); // ініціалізація
    // updateSlideCount();

    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  return (
    <div className={scss.sliderWrapper}>
      <button
            className={clsx(scss.arrow, scss.arrowLeft)}
            onClick={() => emblaApi?.scrollPrev()}
            disabled={!canScrollPrev}
            aria-label="Попередній слайд"
          >
            <ArrowSliderLeft className={scss.iconLeft} aria-hidden />
          </button>
      <div className={scss.embla} ref={emblaRef}>
        <div className={clsx(scss.embla__container, className)}>{children}</div>
      </div>

       <button
            className={clsx(scss.arrow, scss.arrowRight)}
            onClick={() => emblaApi?.scrollNext()}
            disabled={!canScrollNext}
            aria-label="Наступний слайд"
          >
            <ArrowSliderRight className={scss.iconRight} aria-hidden />
          </button>

      {/* Стрілки */}
      {/* <div className={scss.controls}>
         {/* <div className={scss.dots}>
          {Array.from({ length: slideCount }).map((_, index) => (
            <button
              key={index}
              className={clsx(scss.dot, {
                [scss.active]: index === selectedIndex,
              })}
              onClick={() => emblaApi && emblaApi.scrollTo(index)}
            />
          ))}
        </div> */}
        {/* <div className={scss.pages}>
          {selectedIndex + 1} / {slideCount}
        </div> */}
        {/* <div className={scss.arrows}>
          <button
            className={clsx(scss.arrow, scss.arrowLeft)}
            onClick={() => emblaApi?.scrollPrev()}
            disabled={!canScrollPrev}
            aria-label="Попередній слайд"
          >
            <ArrowSliderLeft className={scss.iconLeft} aria-hidden />
          </button>
          <button
            className={clsx(scss.arrow, scss.arrowRight)}
            onClick={() => emblaApi?.scrollNext()}
            disabled={!canScrollNext}
            aria-label="Наступний слайд"
          >
            <ArrowSliderRight className={scss.iconRight} aria-hidden />
          </button>
        </div> */}
       
      {/* </div> */} 
    </div>
  );
};

export default Slider;
