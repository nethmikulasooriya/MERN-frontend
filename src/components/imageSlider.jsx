import { useState } from "react";

export default function ImageSlider(props) {
  const images = props.images || [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentImage = images[currentIndex];

  return (
    <div className="w-[500px] h-[600px] ">
      {currentImage ? (
        <img
          src={currentImage}
          alt={`Product image ${currentIndex + 1}`}
          className="w-full h-[500px] object-cover rounded-3xl"
        />
      ) : (
        <div className="w-full h-[500px] flex items-center justify-center rounded-3xl bg-gray-100 text-gray-500">
          No images available
        </div>
      )}
      <div className="w-full h-[100px] flex justify-center items-center">
        {images.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              aria-label={`View product image ${index + 1}`}
              aria-pressed={index === currentIndex}
              onClick={() => {
                setCurrentIndex(index);
              }}
              className="m-2 h-[90px] w-[90px] cursor-pointer overflow-hidden rounded-2xl hover:border-4 hover:border-accent"
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