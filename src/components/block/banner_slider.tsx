"use client";

import { AnimatePresence, LayoutGroup, motion, wrap } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, type MouseEventHandler } from "react";

interface BannerSliderPropsInterface {
  bannerData: {
    id: string;
    image: string;
    imageMobile: string;
    redirectUrl: string | null;
  }[];
}

const sliderVariants = {
  enter: (direction: number) => {
    return {
      x: direction > 0 ? 500 : -500,
      opacity: 0,
    };
  },
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => {
    return {
      zIndex: 0,
      x: direction < 0 ? 500 : -500,
      opacity: 0,
    };
  },
};
const swipeConfidenceThreshold = 500;
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity;
};

const BannerSliderSection = ({ bannerData }: BannerSliderPropsInterface) => {
  const router = useRouter();

  const [[currentPage, direction], setCurrentPage] = useState([0, 0]);
  const [windowSize, setWindowSize] = useState<{
    innerWidth: number;
    innerHeight: number;
  }>();

  const imageIndex = wrap(0, bannerData.length, currentPage);

  function setPage(newPage: number, newDirection: number | null) {
    newDirection ??= newPage - currentPage;
    setCurrentPage([newPage, newDirection]);
  }

  useEffect(() => {
    function getWindowSize() {
      const { innerWidth, innerHeight } = window;
      return { innerWidth, innerHeight };
    }

    function handleWindowResize() {
      setWindowSize(getWindowSize());
    }

    setWindowSize(getWindowSize());

    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  console.log(windowSize)

  if (windowSize === undefined) {
    return;
  }

  return (
    <section className="aspect-square w-full md:aspect-[3/1] md:max-h-[450px] mx-auto max-w-4xl">
      <div className="relative h-full overflow-hidden">
        <div className="relative h-full w-full">
          <AnimatePresence initial={false} custom={direction}>
            <motion.img
              layout
              key={currentPage}
              className={`${bannerData[imageIndex]?.redirectUrl === null ? "" : "cursor-pointer"} absolute h-full w-full rounded-xl object-cover object-center`}
              src={
                windowSize?.innerWidth >= 768
                  ? bannerData[imageIndex]?.image
                  : bannerData[imageIndex]?.imageMobile
              }
              onClick={() =>
                router.push(bannerData[imageIndex]?.redirectUrl ?? "#")
              }
              custom={direction}
              variants={sliderVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={1}
              onDragEnd={(e, { offset, velocity }) => {
                const swipe = swipePower(offset.x, velocity.x);

                if (swipe < -swipeConfidenceThreshold) {
                  setCurrentPage([currentPage + 1, 1]);
                } else if (swipe > swipeConfidenceThreshold) {
                  setCurrentPage([currentPage - 1, -1]);
                }
              }}
            />
          </AnimatePresence>
        </div>

        <LayoutGroup id="mentoring_header">
          <div
            className="prev absolute left-[3rem] top-[90%] z-10 translate-y-[-50%] rotate-180 sm:top-[50%] bg-white p-2 rounded-full"
            onClick={() =>
              setPage(
                currentPage - 1 >= 0 ? currentPage - 1 : bannerData.length - 1,
                -1,
              )
            }
          >
            <ChevronRight className=" text-primary" />
          </div>

          <div className="absolute bottom-[1rem] left-[50%] z-10 flex translate-x-[-50%] items-center gap-2">
            {bannerData.map((page, index) => (
              <Dot
                key={index}
                onClick={() => setPage(index, null)}
                isSelected={index === currentPage}
              />
            ))}
          </div>

          <div
            className="next absolute right-[3rem] top-[90%] z-10 translate-y-[-50%] sm:top-[50%] bg-white p-2 rounded-full"
            onClick={() =>
              setPage(
                currentPage + 1 <= bannerData.length - 1 ? currentPage + 1 : 0,
                1,
              )
            }
          >
            <ChevronRight className=" text-primary" />
          </div>
        </LayoutGroup>
      </div>
    </section>
  );
};

function Dot({
  isSelected,
  onClick,
}: {
  isSelected: boolean;
  onClick: MouseEventHandler<HTMLDivElement>;
}) {
  return (
    <div className="cursor-pointer p-2" onClick={onClick}>
      <div className=" relative h-2 w-2 rounded-full bg-white">
        {isSelected && (
          <motion.div
            className=" absolute -left-[2px] -top-[2px] h-3 w-5 rounded-full bg-primary"
            layoutId="highlight"
          />
        )}
      </div>
    </div>
  );
}

export default BannerSliderSection;
