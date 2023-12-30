import { useTranslations } from "next-intl";
import ClassAccordion from "./Wrapper";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import NextLink from "next/link";

type ModuleAccordionProps = {
    isModule: boolean;
    description?: string;
    items: {
        title: string;
        href: string;
    }[]
}

export default function ModuleAccordion({ isModule, description, items }: ModuleAccordionProps) {
    const t = useTranslations('accordion');
    return (
        <ClassAccordion id={4} isModule={isModule} title={t(isModule ? 'module' : 'assignment')}>
            <Typography mb={2}>{description}</Typography>
            {
                items.map((dt) => <Link component={NextLink} href={dt.href} variant='h5' fontWeight={500}
                    underline="always" aria-current={undefined} key={dt.title}>
                    {dt.title}
                </Link>)
            }
        </ClassAccordion>
    )
}

