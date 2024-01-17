import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CardWrapper from "./Wrapper/Normal";
import { useTranslations } from "next-intl";
import { formatNumberToIdr } from "@/lib/utils";
import Link from "next/link";

type CardProps = {
    img: string;
    title: string;
    programId: number;
    // null price means that it's free ( not paid )
    price: number | null;
    href: string;
    // onEnroll: undefined | (() => void);
}

export default function ProgramCard({ img, title, price, href, programId }: CardProps) {
    const t = useTranslations('program_selection');
    return (
        <CardWrapper alt={title} src={img}>
            <Typography variant="h5" component="h5" fontWeight={500} mb={2}>{title}</Typography>
            <Typography variant="h3" component="h3" mb={4} fontWeight={600}>
                {!price
                    ? t('paid')
                    : formatNumberToIdr(price)
                }
            </Typography>
            <Button variant="outlined" size="small" href={href}
                // onClick={onEnroll} disabled={!onEnroll}
                sx={{ width: 'fit-content', mb: 3, alignSelf: 'center' }}>
                {/* <Link href={href} as={{
                    pathname: href,
                    query: { id: programId }
                }}> */}
                    {t('button')}
                {/* </Link> */}
            </Button>
        </CardWrapper>
    )
}
