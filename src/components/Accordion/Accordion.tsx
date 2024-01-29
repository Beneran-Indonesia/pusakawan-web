import { useTranslations } from "next-intl";
import ClassAccordion from "./Wrapper";
import Link from "@mui/material/Link";
import NextLink from "next/link";

type Items = { title: string; href: string };

type ModuleAccordionProps = {
    userIsEnrolled: boolean;
} & (
        | { isModule: true; items: Items[] }
        | { isModule: false; items: null | string[] }
    );

export default function ModuleAccordion({ isModule, items, userIsEnrolled }: ModuleAccordionProps) {
    const t = useTranslations('accordion');
    console.log("ACCORDION: ", items)
    return (
        <ClassAccordion id={4} isModule={isModule} title={t(isModule ? 'module.title' : 'assignment')}>
            {items && (
                <>
                {items.map((item, idx) => (
                        <AccordionItem
                            userIsEnrolled={userIsEnrolled}
                            href={isModule ? (item as Items).href : item as string}
                            title={isModule ? (item as Items).title : t('assignment') + ` ${idx + 1}`}
                            key={isModule ? (item as Items).title : `assignment${idx}`}
                        />
                    ))}
                </>
            )}
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