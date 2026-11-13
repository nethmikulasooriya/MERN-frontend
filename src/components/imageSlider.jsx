import { useState } from "react";

export default function ImageSlider(props) {
  const images = Array.isArray(props.images) ? props.images : [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentImage = images[currentIndex];

  return (
    <div className="w-full max-w-[500px] px-4 md:px-0">
      {currentImage ? (
        <img
          src={currentImage}
          alt={`Product image ${currentIndex + 1}`}
          className="aspect-[4/3] w-full rounded-3xl object-cover"
        />
      ) : (
        <div className="flex aspect-[4/3] w-full items-center justify-center rounded-3xl bg-gray-100 text-gray-500">
          No images available
        </div>
      )}
      <div className="flex w-full items-center justify-start overflow-x-auto py-2 md:justify-center">
        {images.map((image, index) => (
          <button
            key={`${image}-${index}`}
            type="button"
            aria-label={`View product image ${index + 1}`}
            aria-pressed={index === currentIndex}
            onClick={() => setCurrentIndex(index)}
            className="m-1 h-16 w-16 shrink-0 cursor-pointer overflow-hidden rounded-xl hover:border-4 hover:border-accent sm:m-2 sm:h-20 sm:w-20"
          >
            <img
              src={image}
              alt=""
              className="h-full w-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}