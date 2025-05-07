// untuk membuat link dengan efek garis bawah

import Link from "next/link";
import { styled } from '@mui/material/styles';

const UnderlinedLink = styled(Link)({
    display: "inline-block",
    paddingBottom: "2px",
    backgroundImage: "linear-gradient(#000 0 0)",
    backgroundPosition: "0 100%",
    backgroundSize: "0% 2px",
    backgroundRepeat: "no-repeat",
    transition: "background-size 0.3s, background-position 0s 0.3s",
    "&:hover": { backgroundPosition: "100% 100%", backgroundSize: "100% 2px" }
});

export default UnderlinedLink