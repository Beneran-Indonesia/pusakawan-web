import ImageWrapper from "./ImageWrapper";

type PusakawanLogoProps = {
    white?: boolean;
    width?: number;
    height?: number;
}

export default function PusakawanLogo({ white = false, width, height }: PusakawanLogoProps) {
    return (
        <ImageWrapper alt="Logo pusakawan" src={white ? "/pusakawan_white.svg" : "/pusakawan.svg"} width={width ?? 130} height={height ?? 30} />
    )
}