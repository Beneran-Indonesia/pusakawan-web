import Image from "next/image"
import { CSSProperties } from "react";

type LogoWrapperProps = {
    style?: CSSProperties;
    alt: string;
    src: any;
    width?: number;
    height?: number;
    priority?: boolean
}

function LogoWrapper({ src, alt, style, width, height, priority = false }: LogoWrapperProps) {
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

export default LogoWrapper;
