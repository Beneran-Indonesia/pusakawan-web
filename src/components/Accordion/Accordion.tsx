import { useTranslations } from "next-intl";
import ClassAccordion from "./Wrapper";
import Link from "@mui/material/Link";
import NextLink from "next/link";

type ModuleAccordionProps = {
    userIsEnrolled: boolean;
} & (
        | { isModule: true; items: { title: string; href: string }[] }
        | { isModule: false; items: null | string }
    );

export default function ModuleAccordion({ isModule, items, userIsEnrolled }: ModuleAccordionProps) {
    const t = useTranslations('accordion');
    return (
        <ClassAccordion id={4} isModule={isModule} title={t(isModule ? 'module.title' : 'assignment')}>
            {
                items
                    ? <>
                        {
                            typeof items === "string"
                                ? <AccordionItem userIsEnrolled={userIsEnrolled} href={items} title={t("assignment") + " 1"} />
                                : items.map((dt) =>
                                    <AccordionItem userIsEnrolled={userIsEnrolled} href={dt.href} title={dt.title} key={dt.title} />
                                )
                        }
                    </>
                    : null
            }

        </ClassAccordion>
    )
}

type AccordionItemProps = {
    userIsEnrolled: boolean;
    href: string;
    title: string;
}

function AccordionItem({ userIsEnrolled, href, title }: AccordionItemProps) {
    const t = useTranslations('accordion');
    return (
        <span title={t(userIsEnrolled ? "module.link_title_enrolled" : "module.link_title_unenrolled")}>
            <Link component={NextLink} href={userIsEnrolled ? href : "#"}
                variant='h5' fontWeight={500} underline="always"
                sx={!userIsEnrolled ? { pointerEvents: 'none' } : undefined}
            >
                {title}
            </Link>
        </span>
    );
}