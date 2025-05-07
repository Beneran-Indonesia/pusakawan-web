import { useTranslations } from "next-intl";
import ClassAccordion from "./Wrapper";
import Link from "@mui/material/Link";
import NextLink from "next/link";

type Items = { title: string; href: string };

type ModuleAccordionProps = {
    userIsEnrolled: boolean;
} & (
    | { isModule: true; items: Items[]; isPostTest?: never }
    | { isModule: false; isPostTest?: boolean; items: null | ({ title: string; href: string } | undefined | null)[] }
);

export default function ModuleAccordion({ isModule, isPostTest = false, items, userIsEnrolled }: ModuleAccordionProps) {
    const t = useTranslations('accordion');
    
    let title = '';
    if (isModule) {
        title = t('module.title');
    } else if (isPostTest) {
        title = t('post_test');
    } else {
        title = t('assignment');
    }
    
    return (
        <ClassAccordion id={4} isModule={isModule} title={title}>
            {items && (
                <>
                    {items.map((item, idx) => {
                        // making sure item exists
                        return (
                            item &&
                            <AccordionItem
                                userIsEnrolled={userIsEnrolled}
                                href={item.href}
                                title={isModule 
                                    ? (item as Items).title 
                                    : isPostTest 
                                        ? t('post_test') + `: ${item.title}`
                                        : t('assignment') + `: ${item.title}`
                                }
                                key={isModule 
                                    ? (item as Items).title 
                                    : isPostTest 
                                        ? `post_test${idx}` 
                                        : `assignment${idx}`
                                }
                            />
                        )
                    })}
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
