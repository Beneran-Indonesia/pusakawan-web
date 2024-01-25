import { useTranslations } from "next-intl";
import ClassAccordion from "./Wrapper";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import NextLink from "next/link";

type ModuleAccordionProps = {
    isModule: boolean;
    description?: string;
    items?: {
        title: string;
        href: string;
    }[];
    userIsEnrolled: boolean;
}

export default function ModuleAccordion({ isModule, description, items, userIsEnrolled }: ModuleAccordionProps) {
    const t = useTranslations('accordion');
    return (
        <ClassAccordion id={4} isModule={isModule} title={t(isModule ? 'module.title' : 'assignment')}>
            <Typography mb={2}>{description}</Typography>
            {
                items && items.map((dt) =>
                    <span key={dt.title} title={t(userIsEnrolled ? "module.link_title_enrolled" : "module.link_title_unenrolled")}>
                        <Link component={NextLink} href={userIsEnrolled ? dt.href : "#"}
                            variant='h5' fontWeight={500} underline="always"
                            sx={!userIsEnrolled ? { pointerEvents: 'none' } : undefined}
                        >
                            {dt.title}
                        </Link>
                    </span>)
            }
        </ClassAccordion>
    )
}

