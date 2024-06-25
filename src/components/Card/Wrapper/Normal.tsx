import Box from "@mui/material/Box";
import ImageWrapper from "../../ImageWrapper";

type CardProps = {
    src: string;
    alt: string;
    children: React.ReactNode;
}

export default function CardWrapper({ src, alt, children }: CardProps) {
    return (
        <Box maxWidth={300} position="relative" border="1px solid #CCC"
            borderRadius="1rem" bgcolor="white" boxShadow={1} flex="0 0 auto"
        >
            <BlurBox />
            <ImageWrapper src={src} alt={alt} width={299} height={130} style={{ borderTopRightRadius: '1rem', borderTopLeftRadius: '1rem', objectFit: 'cover' }} />
            <Box p={1.5} display="flex" flexDirection="column">
                {children}
            </Box>
        </Box>
    )
}

function BlurBox() {
    return (
        <div
            style={{
                position: 'absolute',
                top: "6rem",
                width: "100%",
                height: "2.5rem",
                background: "linear-gradient(0deg, #FFF 21.66%, rgba(255, 255, 255, 0.40) 66.91%, rgba(255, 255, 255, 0.00) 100%)"
            }}
        />
    )
}