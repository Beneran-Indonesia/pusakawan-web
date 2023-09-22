import Image from "next/image"
import { CSSProperties } from "react";

type ImageWrapperProps = {
    style?: CSSProperties;
    alt: string;
    src: any;
    width?: number;
    height?: number;
    priority?: boolean
}

function ImageWrapper({ src, alt, style, width, height, priority = false }: ImageWrapperProps) {
    return (
        <Image
            src={src}
            alt={alt}
            style={style}
            width={width}
            height={height}
            priority={priority}
        />
    )
}

export default ImageWrapper;
