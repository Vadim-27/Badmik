// "use client";

// import { FC, ReactNode, useEffect, useState } from "react";
// import clsx from "clsx";
// import Autoplay from "embla-carousel-autoplay";
// import useEmblaCarousel from "embla-carousel-react";

// // import options from "@/configs/embla-slider";
// import options from "@/app/components/configs/embla-slider";

// import scss from "./Slider.module.scss";

// interface ISlider {
//   children: ReactNode;
//   className?: string;
// }

// const Slider: FC<ISlider> = ({ children, className }) => {
 
//   const [emblaRef, emblaApi] = useEmblaCarousel(options, [
//     Autoplay({
//       playOnInit: true,
//       delay: 50000,
//       stopOnInteraction: false,
//       stopOnMouseEnter: true,
//     }),
//   ]);
//    console.log("emblaRef", emblaRef);
//   const [selectedIndex, setSelectedIndex] = useState(0);
//   const [slideCount, setSlideCount] = useState(0);
//   console.log("children", children);

//   useEffect(() => {
//     if (!emblaApi) return;

//     const onSelect = () => {
//       setSelectedIndex(emblaApi.selectedScrollSnap());
//     };

//     const updateSlideCount = () => {
//       const slideNodes = emblaApi.slideNodes();
//       console.log("slideNodes:", slideNodes);
//       setSlideCount(slideNodes.length);
//     };

//     emblaApi.on("select", onSelect);
//     updateSlideCount();

//     // Додаємо обробку на випадок, якщо слайди динамічно змінюються
//     const resizeObserver = new ResizeObserver(() => {
//       updateSlideCount();
//     });
//     resizeObserver.observe(emblaApi.rootNode());

//     return () => {
//       emblaApi.off("select", onSelect);
//       resizeObserver.disconnect();
//     };
//   }, [emblaApi]);




//   console.log("slideCount", slideCount); // Перевірка значення slideCount

//   return (
//     <div>
//       <div className={scss.embla} ref={emblaRef}>
//         <div className={clsx(scss.embla__container, className)}>{children}</div>
//       </div>
//       <div className={scss.dots}>
//         {Array.from({ length: slideCount }).map((_, index) => (
//           <button
//             key={index}
//             className={clsx(scss.dot, {
//               [scss.active]: index === selectedIndex,
//             })}
//             onClick={() => emblaApi && emblaApi.scrollTo(index)}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Slider;

//================================

"use client";

import { FC, ReactNode, useEffect, useState } from "react";
import clsx from "clsx";
import Autoplay from "embla-carousel-autoplay";
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
    Autoplay({
      playOnInit: true,
      delay: 5000,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
    }),
  ]);

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setCanScrollPrev(emblaApi.canScrollPrev());
      setCanScrollNext(emblaApi.canScrollNext());
    };

    emblaApi.on("select", onSelect);
    onSelect(); // ініціалізація

    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  return (
    <div className={scss.sliderWrapper}>
      <div className={scss.embla} ref={emblaRef}>
        <div className={clsx(scss.embla__container, className)}>{children}</div>
      </div>

      {/* Стрілки */}
      <div className={scss.arrows}>
      <button
        className={clsx(scss.arrow, scss.arrowLeft)}
        onClick={() => emblaApi?.scrollPrev()}
        disabled={!canScrollPrev}
        aria-label="Попередній слайд"
      >
       <  ArrowSliderLeft className={scss.iconLeft} aria-hidden />
      </button>
      <button
        className={clsx(scss.arrow, scss.arrowRight)}
        onClick={() => emblaApi?.scrollNext()}
        disabled={!canScrollNext}
        aria-label="Наступний слайд"
      >
        <ArrowSliderRight className={scss.iconRight} aria-hidden />
      </button>
      </div>
    </div>
  );
};

export default Slider;

