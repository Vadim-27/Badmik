

// "use client";

// import { FC, ReactNode, useEffect, useState } from "react";
// import clsx from "clsx";
// import Autoplay from "embla-carousel-autoplay";
// import useEmblaCarousel from "embla-carousel-react";

// import options from "@/app/components/configs/embla-slider";
// import ArrowSliderLeft from "@/app/assets/icons/ArrowSliderLeft.svg";
// import ArrowSliderRight from "@/app/assets/icons/ArrowSliderRight.svg";

// import scss from "./Slider.module.scss";

// interface ISlider {
//   children: ReactNode;
//   className?: string;
// }

// const Slider: FC<ISlider> = ({ children, className }) => {
//   const [emblaRef, emblaApi] = useEmblaCarousel(options, [
//     Autoplay({
//       playOnInit: true,
//       delay: 5000,
//       stopOnInteraction: false,
//       stopOnMouseEnter: true,
//     }),
//   ]);

//   const [canScrollPrev, setCanScrollPrev] = useState(false);
//   const [canScrollNext, setCanScrollNext] = useState(false);

//   // const [selectedIndex, setSelectedIndex] = useState(0);
//   // const [slideCount, setSlideCount] = useState(0);

//   useEffect(() => {
//     if (!emblaApi) return;

//     const onSelect = () => {
//       setCanScrollPrev(emblaApi.canScrollPrev());
//       setCanScrollNext(emblaApi.canScrollNext());
//       // setSelectedIndex(emblaApi.selectedScrollSnap());
//     };

//     // const updateSlideCount = () => {
//     //   setSlideCount(emblaApi.slideNodes().length);
//     // };

//     emblaApi.on("select", onSelect);
//     onSelect(); // ініціалізація
//     // updateSlideCount();

//     return () => {
//       emblaApi.off("select", onSelect);
//     };
//   }, [emblaApi]);

//   return (
//     <div className={scss.sliderWrapper}>
//       <div className={scss.embla} ref={emblaRef}>
//         <div className={clsx(scss.embla__container, className)}>{children}</div>
//       </div>

//       {/* Стрілки */}
//       <div className={scss.controls}>
//          {/* <div className={scss.dots}>
//           {Array.from({ length: slideCount }).map((_, index) => (
//             <button
//               key={index}
//               className={clsx(scss.dot, {
//                 [scss.active]: index === selectedIndex,
//               })}
//               onClick={() => emblaApi && emblaApi.scrollTo(index)}
//             />
//           ))}
//         </div> */}
//         {/* <div className={scss.pages}>
//           {selectedIndex + 1} / {slideCount}
//         </div> */}
//         <div className={scss.arrows}>
//           <button
//             className={clsx(scss.arrow, scss.arrowLeft)}
//             onClick={() => emblaApi?.scrollPrev()}
//             disabled={!canScrollPrev}
//             aria-label="Попередній слайд"
//           >
//             <ArrowSliderLeft className={scss.iconLeft} aria-hidden />
//           </button>
//           <button
//             className={clsx(scss.arrow, scss.arrowRight)}
//             onClick={() => emblaApi?.scrollNext()}
//             disabled={!canScrollNext}
//             aria-label="Наступний слайд"
//           >
//             <ArrowSliderRight className={scss.iconRight} aria-hidden />
//           </button>
//         </div>
       
//       </div>
//     </div>
//   );
// };

// export default Slider;


//====================================
// "use client";

// import { FC, ReactNode, useEffect, useState } from "react";
// import clsx from "clsx";
// import Autoplay from "embla-carousel-autoplay";
// import useEmblaCarousel from "embla-carousel-react";

// import ArrowSliderLeft from "@/app/assets/icons/ArrowSliderLeft.svg";
// import ArrowSliderRight from "@/app/assets/icons/ArrowSliderRight.svg";
// import scss from "./Slider.module.scss";

// interface ISlider {
//   children: ReactNode;
//   className?: string;
// }

// const Slider: FC<ISlider> = ({ children, className }) => {
//   const [emblaRef, emblaApi] = useEmblaCarousel(
//     { align: "center", loop: true, containScroll: "trimSnaps" },
//     [
//       Autoplay({
//         playOnInit: true,
//         delay: 5000,
//         stopOnInteraction: false,
//         stopOnMouseEnter: true,
//       }),
//     ]
//   );

//   const [canScrollPrev, setCanScrollPrev] = useState(false);
//   const [canScrollNext, setCanScrollNext] = useState(false);

//   useEffect(() => {
//     if (!emblaApi) return;

//     const slides = emblaApi.slideNodes();

//     const update = () => {
//       setCanScrollPrev(emblaApi.canScrollPrev());
//       setCanScrollNext(emblaApi.canScrollNext());

//       const selected = emblaApi.selectedScrollSnap();
//       slides.forEach((el, i) => {
//         if (i === selected) el.classList.add(scss.isActive);
//         else el.classList.remove(scss.isActive);
//       });
//     };

//     update();
//     emblaApi.on("select", update);
//     emblaApi.on("reInit", update);

//     return () => {
//       emblaApi.off("select", update);
//       emblaApi.off("reInit", update);
//     };
//   }, [emblaApi]);

//   return (
//     <div className={scss.sliderWrapper}>
//       <div className={scss.embla} ref={emblaRef}>
//         <div className={clsx(scss.embla__container, className)}>{children}</div>
//       </div>

//       <div className={scss.controls}>
//         <div className={scss.arrows}>
//           <button
//             className={clsx(scss.arrow, scss.arrowLeft)}
//             onClick={() => emblaApi?.scrollPrev()}
//             disabled={!canScrollPrev}
//             aria-label="Попередній слайд"
//           >
//             <ArrowSliderLeft className={scss.iconLeft} aria-hidden />
//           </button>
//           <button
//             className={clsx(scss.arrow, scss.arrowRight)}
//             onClick={() => emblaApi?.scrollNext()}
//             disabled={!canScrollNext}
//             aria-label="Наступний слайд"
//           >
//             <ArrowSliderRight className={scss.iconRight} aria-hidden />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Slider;


//====================================


"use client";

import { FC, ReactNode, useCallback, useEffect, useRef, useState } from "react";
import clsx from "clsx";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import type { EmblaCarouselType, EmblaEventType } from "embla-carousel";

import ArrowSliderLeft from "@/app/assets/icons/ArrowSliderLeft.svg";
import ArrowSliderRight from "@/app/assets/icons/ArrowSliderRight.svg";
import scss from "./Slider.module.scss";

interface ISlider {
  children: ReactNode;
  className?: string;
}

const TWEEN_FACTOR_BASE = 0.52;

// clamp helper
const clamp = (n: number, min: number, max: number) => Math.min(Math.max(n, min), max);

const Slider: FC<ISlider> = ({ children, className }) => {
  // важливо: align "center", loop — як у демо зі Scale
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { align: "center", loop: true, containScroll: "trimSnaps" },
    [
      Autoplay({
        playOnInit: true,
        delay: 5000,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
      }),
    ]
  );

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  // ▼ tween state з демо
  const tweenFactor = useRef(0);
  const tweenNodes = useRef<HTMLElement[]>([]);

  // беремо самі слайди як ноди для скейлу (без .embla__slide__number)
  const setTweenNodes = useCallback((api: EmblaCarouselType) => {
    tweenNodes.current = api.slideNodes() as HTMLElement[]; // кожен direct slide element
  }, []);

  const setTweenFactor = useCallback((api: EmblaCarouselType) => {
    tweenFactor.current = TWEEN_FACTOR_BASE * api.scrollSnapList().length;
  }, []);

  const tweenScale = useCallback((api: EmblaCarouselType, eventName?: EmblaEventType) => {
    const engine = api.internalEngine();
    const scrollProgress = api.scrollProgress();
    const slidesInView = api.slidesInView();
    const isScrollEvent = eventName === "scroll";

    api.scrollSnapList().forEach((snap, snapIndex) => {
      let diffToTarget = snap - scrollProgress;
      const slidesInSnap = engine.slideRegistry[snapIndex];

      slidesInSnap.forEach((slideIndex) => {
        if (isScrollEvent && !slidesInView.includes(slideIndex)) return;

        if (engine.options.loop) {
          engine.slideLooper.loopPoints.forEach((lp) => {
            const target = lp.target();
            if (slideIndex === lp.index && target !== 0) {
              const sign = Math.sign(target);
              if (sign === -1) diffToTarget = snap - (1 + scrollProgress);
              if (sign === 1) diffToTarget = snap + (1 - scrollProgress);
            }
          });
        }

        const tweenValue = 1 - Math.abs(diffToTarget * tweenFactor.current);
        const scale = clamp(tweenValue, 0, 1).toString();

        const node = tweenNodes.current[slideIndex];
        if (node) node.style.transform = `scale(${scale})`;
      });
    });
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setCanScrollPrev(emblaApi.canScrollPrev());
      setCanScrollNext(emblaApi.canScrollNext());
    };

    setTweenNodes(emblaApi);
    setTweenFactor(emblaApi);
    tweenScale(emblaApi); // ініціальна постановка scale

    emblaApi
      .on("select", onSelect)
      .on("reInit", onSelect)
      .on("reInit", setTweenNodes)
      .on("reInit", setTweenFactor)
      .on("reInit", tweenScale)
      .on("scroll", tweenScale)
      .on("slideFocus", tweenScale);

    onSelect();

    return () => {
      emblaApi
        .off("select", onSelect)
        .off("reInit", onSelect)
        .off("reInit", setTweenNodes)
        .off("reInit", setTweenFactor)
        .off("reInit", tweenScale)
        .off("scroll", tweenScale)
        .off("slideFocus", tweenScale);
    };
  }, [emblaApi, setTweenNodes, setTweenFactor, tweenScale]);

  return (
    <div className={scss.sliderWrapper}>
      <div className={scss.embla} ref={emblaRef}>
        <div className={clsx(scss.embla__container, className)}>
          {children /* твої <div className={styles.slide}>… */ }
        </div>
      </div>

      <div className={scss.controls}>
        <div className={scss.arrows}>
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
        </div>
      </div>
    </div>
  );
};

export default Slider;


//======================================="use client";

// // EmblaCarouselScale.tsx
// "use client";

// import React, { useCallback, useEffect, useRef, useState } from "react";
// import useEmblaCarousel from "embla-carousel-react";
// import type { EmblaCarouselType, EmblaEventType, EmblaOptionsType } from "embla-carousel";
// import s from "./Slider.module.scss";

// const TWEEN_FACTOR_BASE = 0.52;
// const clamp = (n: number, min: number, max: number) => Math.min(Math.max(n, min), max);

// type Item = { id: number; image: string };

// type Props = {
//   items: Item[];
//   options?: EmblaOptionsType;
// };

// export default function EmblaCarouselScale({ items, options }: Props) {
//   const [emblaRef, emblaApi] = useEmblaCarousel(
//     { align: "center", loop: true, containScroll: "trimSnaps", ...options }
//   );

//   const [selectedIndex, setSelectedIndex] = useState(0);
//   const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
//   const [prevDisabled, setPrevDisabled] = useState(true);
//   const [nextDisabled, setNextDisabled] = useState(true);

//   // tween
//   const tweenFactor = useRef(0);
//   const tweenNodes = useRef<HTMLElement[]>([]);

//   const setTweenNodes = useCallback((api: EmblaCarouselType) => {
//     // масштабуємо весь слайд (кореневий елемент .slide)
//     tweenNodes.current = api.slideNodes() as HTMLElement[];
//   }, []);

//   const setTweenFactor = useCallback((api: EmblaCarouselType) => {
//     tweenFactor.current = TWEEN_FACTOR_BASE * api.scrollSnapList().length;
//   }, []);

//   const tweenScale = useCallback((api: EmblaCarouselType, eventName?: EmblaEventType) => {
//     const engine = api.internalEngine();
//     const scrollProgress = api.scrollProgress();
//     const slidesInView = api.slidesInView();
//     const isScrollEvent = eventName === "scroll";

//     api.scrollSnapList().forEach((snap, snapIndex) => {
//       let diffToTarget = snap - scrollProgress;
//       const slidesInSnap = engine.slideRegistry[snapIndex];

//       slidesInSnap.forEach((slideIndex) => {
//         if (isScrollEvent && !slidesInView.includes(slideIndex)) return;

//         if (engine.options.loop) {
//           engine.slideLooper.loopPoints.forEach((lp) => {
//             const target = lp.target();
//             if (slideIndex === lp.index && target !== 0) {
//               const sign = Math.sign(target);
//               if (sign === -1) diffToTarget = snap - (1 + scrollProgress);
//               if (sign === 1)  diffToTarget = snap + (1 - scrollProgress);
//             }
//           });
//         }

//         const tweenValue = 1 - Math.abs(diffToTarget * tweenFactor.current);
//         const scale = clamp(tweenValue, 0, 1);
//         const node = tweenNodes.current[slideIndex];
//         if (node) node.style.transform = `scale(${scale})`;
//       });
//     });
//   }, []);

//   useEffect(() => {
//     if (!emblaApi) return;

//     const onSelect = () => {
//       setSelectedIndex(emblaApi.selectedScrollSnap());
//       setPrevDisabled(!emblaApi.canScrollPrev());
//       setNextDisabled(!emblaApi.canScrollNext());
//     };

//     setScrollSnaps(emblaApi.scrollSnapList());
//     setTweenNodes(emblaApi);
//     setTweenFactor(emblaApi);
//     tweenScale(emblaApi);
//     onSelect();

//     emblaApi
//       .on("select", onSelect)
//       .on("reInit", () => {
//         setScrollSnaps(emblaApi.scrollSnapList());
//         setTweenNodes(emblaApi);
//         setTweenFactor(emblaApi);
//         tweenScale(emblaApi);
//         onSelect();
//       })
//       .on("scroll", tweenScale)
//       .on("slideFocus", tweenScale);

//     return () => {
//       emblaApi
//         .off("select", onSelect)
//         .off("reInit", onSelect)
//         .off("scroll", tweenScale)
//         .off("slideFocus", tweenScale);
//     };
//   }, [emblaApi, setTweenNodes, setTweenFactor, tweenScale]);

//   return (
//     <div className={s.embla}>
//       <div className={s.viewport} ref={emblaRef}>
//         <div className={s.container}>
//           {items.map((it) => (
//             <div className={s.slide} key={it.id}>
//               <div className={s.inner}>
//                 <img src={it.image} alt="" className={s.img} />
//                 {/* Якщо треба Next/Image:
//                   <div className={s.imgWrap}>
//                     <Image src={it.image} alt="" fill className={s.img} />
//                   </div>
//                 */}
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       <div className={s.controls}>
//         <div className={s.buttons}>
//           <button className={s.button} onClick={() => emblaApi?.scrollPrev()} disabled={prevDisabled}>‹</button>
//           <button className={s.button} onClick={() => emblaApi?.scrollNext()} disabled={nextDisabled}>›</button>
//         </div>
//         <div className={s.dots}>
//           {scrollSnaps.map((_, i) => (
//             <button
//               key={i}
//               onClick={() => emblaApi?.scrollTo(i)}
//               className={`${s.dot} ${i === selectedIndex ? s.dotSelected : ""}`}
//               aria-label={`Go to ${i + 1}`}
//             />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }



