import { Box, Button, Typography } from "@mui/material";
import ImageWrapper from "../ImageWrapper";

type CardProps = {
    img: string;
    title: string;
    text: string;
    button: string;
}

export default function Card({ img, title, text, button }: CardProps) {
    return (
        <Box maxWidth={256} textAlign="center" position="relative" border="1px solid #CCC" borderRadius="1rem" pb={3} bgcolor="white">
            <BlurBox />
            <ImageWrapper src={img} alt={title} width={255} height={130} style={{ borderTopRightRadius: '1rem', borderTopLeftRadius: '1rem', objectFit: 'cover' }} />
            <Typography variant="h5" component="h5" fontWeight={500} mb={2}>{title}</Typography>
            <Typography mb={4} mx={3}>{text}</Typography>
            <Button variant="outlined" size="large">{button}</Button>
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