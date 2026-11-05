import { useState } from "react";

export default function ImageSlider(props) {
  const images = Array.isArray(props.images) ? props.images : [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentImage = images[currentIndex];

  return (
    <div className="w-125 h-150">
      {currentImage ? (
        <img
          src={currentImage}
          alt={`Product image ${currentIndex + 1}`}
          className="w-full h-125 object-cover rounded-3xl"
        />
      ) : (
        <div className="w-full h-125 flex items-center justify-center rounded-3xl bg-gray-100 text-gray-500">
          No images available
        </div>
      )}
      <div className="w-full h-25 flex justify-center items-center">
        {images.map((image, index) => (
          <button
            key={`${image}-${index}`}
            type="button"
            aria-label={`View product image ${index + 1}`}
            aria-pressed={index === currentIndex}
            onClick={() => setCurrentIndex(index)}
            className="m-2 h-22.5 w-22.5 cursor-pointer overflow-hidden rounded-2xl hover:border-4 hover:border-accent"
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