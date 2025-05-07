//  menampilkan gambar dengan konfigurasi yang fleksibel

import Image, { StaticImageData } from "next/image"
import { CSSProperties } from "react";

type ImageWrapperProps = {
    style?: CSSProperties;
    alt: string;
    src: string | StaticImageData;
    width?: number;
    height?: number;
    priority?: boolean;
    unoptimized?: boolean;
}

function ImageWrapper({ src, alt, style, width, height, priority = false, unoptimized=true }: ImageWrapperProps) {
    return (
        <Image
            src={src}
            alt={alt}
            style={style}
            width={width}
            height={height}
            priority={priority}
            unoptimized={unoptimized}
        />
    )
}

export default ImageWrapper;
