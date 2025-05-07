// menampilkan sebuah kartu dengan gambar, judul, teks deskriptif, dan tombol aksi
// halaman promosi modul/pelajaran
// konten “lihat detail”

import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CardWrapper from "./Wrapper/Normal";

type CardProps = {
    img: string;
    title: string;
    text: string;
    button: string;
}

export default function Card({ img, title, text, button }: CardProps) {
    return (
        <CardWrapper src={img} alt={title}>
            <Typography variant="h5" component="h5" fontWeight={500} mb={2}>{title}</Typography>
            <Typography mb={4} mx={3}>{text}</Typography>
            <Button variant="outlined" size="large">{button}</Button>
        </CardWrapper>
    )
}
