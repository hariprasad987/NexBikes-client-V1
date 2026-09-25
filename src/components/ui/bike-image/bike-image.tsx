"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

const IMAGE_NOT_AVAILABLE = "/images/bikes/bike-image-not-available.png";
const IMAGE_UNABLE_TO_LOAD = "/images/bikes/bike-image-unable-to-load.png";

type BikeImageProps = Omit<ImageProps, "alt" | "onError" | "src"> & {
  alt: string;
  src?: ImageProps["src"] | null;
};

type BikeImageContentProps = Omit<BikeImageProps, "src"> & {
  initialSource: ImageProps["src"];
};

function BikeImageContent({ alt, initialSource, ...props }: BikeImageContentProps) {
  const [source, setSource] = useState(initialSource);
  const imageFailedToLoad = source === IMAGE_UNABLE_TO_LOAD;
  const imageIsUnavailable = source === IMAGE_NOT_AVAILABLE;

  return (
    <Image
      {...props}
      alt={
        imageFailedToLoad
          ? "Bike image could not load"
          : imageIsUnavailable
            ? "Bike image not available"
            : alt
      }
      onError={() => {
        if (!imageFailedToLoad) {
          setSource(IMAGE_UNABLE_TO_LOAD);
        }
      }}
      src={source}
    />
  );
}

export function BikeImage({ src, ...props }: BikeImageProps) {
  const hasSource = typeof src === "string" ? Boolean(src.trim()) : Boolean(src);
  const initialSource = hasSource ? src! : IMAGE_NOT_AVAILABLE;
  const sourceKey = typeof initialSource === "string" ? initialSource : JSON.stringify(initialSource);

  return <BikeImageContent {...props} initialSource={initialSource} key={sourceKey} />;
}
