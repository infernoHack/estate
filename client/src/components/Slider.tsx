import { useEffect } from "react";
import { createPortal } from "react-dom";

type SliderProps = {
  images: { url: string }[];
  sliderIdx: number | null;
  handleSliderIdx: (val: string) => void;
};

function Slider({ images, sliderIdx, handleSliderIdx }: SliderProps) {
  useEffect(
    function () {
      const handleKeyboardEvent = (e: KeyboardEvent) => {
        if (e.code === "Escape") {
          handleSliderIdx("null");
        } else if (e.code === "ArrowLeft") {
          handleSliderIdx("prev");
        } else if (e.code === "ArrowRight") {
          handleSliderIdx("next");
        }
      };
      document.addEventListener("keydown", handleKeyboardEvent);

      return () => {
        document.removeEventListener("keydown", handleKeyboardEvent);
      };
    },
    [handleSliderIdx],
  );

  return createPortal(
    <div className="fixed left-0 top-0 z-20 flex h-screen w-screen justify-between bg-black transition-all">
      <button
        className="absolute right-8 top-8 z-30 p-4 text-4xl font-semibold text-white"
        onClick={() => handleSliderIdx("null")}
      >
        X
      </button>
      <button
        className="absolute left-10 my-auto h-full"
        onClick={() => handleSliderIdx("prev")}
      >
        <img
          src="/arrow.png"
          className="h-12 hover:shadow-xl lg:h-20"
          alt="prev-button"
        />
      </button>
      <div className="h-screen w-full lg:w-screen">
        <img
          src={images[sliderIdx!].url}
          className="h-full w-full object-cover "
          alt="house-img"
        />
      </div>
      <button
        className="absolute right-10 my-auto h-full rotate-180"
        onClick={() => handleSliderIdx("prev")}
      >
        <img src="/arrow.png" className="h-12 lg:h-20" alt="next-button" />
      </button>
    </div>,
    document.body,
  );
}

export default Slider;
