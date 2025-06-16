import { useTranslations } from "next-intl";
import ClassAccordion from "./Wrapper";
import Link from "@mui/material/Link";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import Modal from "../Modal";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

type Items = { title: string; href: string };

type ModuleAccordionProps = {
    userIsEnrolled: boolean;
    accordionType?: 'module' | 'assignment' | 'post-test';
    assignmentTitle?: string; // untuk accordion/konten
} & (
    | { isModule: true; items: Items[] }
    | { isModule: false; items: null | ({ title: string; href: string } | undefined | null)[] }
);

export default function ModuleAccordion({
    isModule,
    items,
    userIsEnrolled,
    accordionType = 'module',
    assignmentTitle 
}: ModuleAccordionProps) {
    const t = useTranslations('accordion');
    const router = useRouter();

    const [modalOpen, setModalOpen] = useState(false);
    const [postTestHref, setPostTestHref] = useState<string | null>(null);

    let title: string;
    let id: number;

    if (accordionType === 'module') {
        title = t('module.title');
        id = 4;
    } else if (accordionType === 'assignment') {
        title = assignmentTitle || t('assignment');
        id = 5;
    } else {
        title = t('post-test');
        id = 6;
    }

    const handleLinkClick = (href: string, isPostTest: boolean, event: React.MouseEvent) => {
        if (isPostTest) {
            event.preventDefault();
            setPostTestHref(href);
            setModalOpen(true);
        }
    };

    const handleModalClose = () => {
        setModalOpen(false);
        setPostTestHref(null);
    };

    const handleConfirmPostTest = () => {
        setModalOpen(false);
        if (postTestHref) {
            router.push(postTestHref);
        }
        setPostTestHref(null);
    };

    return (
        <>
            <ClassAccordion 
                id={id} 
                isModule={isModule} 
                title={title} 
                isPostTest={accordionType === 'post-test'}
            >
                {items && (
                    <>
                        {items.map((item, idx) => {
                            return (
                                item && (
                                    <AccordionItem
                                        userIsEnrolled={userIsEnrolled}
                                        href={item.href}
                                        title={
                                            accordionType === 'module'
                                                ? (item as Items).title
                                                : `${title}: ${item.title}`
                                        }
                                        key={accordionType === 'module' ? (item as Items).title : `${accordionType}${idx}`}
                                        isPostTest={accordionType === 'post-test'}
                                        onClick={(e) => handleLinkClick(item.href, accordionType === 'post-test', e)}
                                    />
                                )
                            );
                        })}
                    </>
                )}
            </ClassAccordion>

            {/* modal untuk post-test*/}
            <Modal 
                isOpen={modalOpen} 
                toggleOpen={handleModalClose}
                boxSx={{ width: 600, p: 4, borderRadius: 2 }}
            >
                <Typography variant="h5" fontWeight={600} mb={2}>
                    {t("postTest.confirm_title")}
                </Typography>

                <Typography mb={3} align="center" color="monochrome.four">
                    {t("postTest.confirm_text")}
                </Typography>

                <Box display="flex" gap={2} justifyContent="flex-end">
                    <Button
                        variant="outlined"
                        size="large"
                        onClick={handleModalClose}
                    >
                        {t("postTest.cancel") || "Cancel"}
                    </Button>

                    <Button
                        variant="contained"
                        size="large"
                        onClick={handleConfirmPostTest}
                    >
                        {t("postTest.confirm_button")}
                    </Button>
                </Box>
            </Modal>
        </>
    );
}

type AccordionItemProps = {
    userIsEnrolled: boolean;
    href: string;
    title: string;
    isPostTest?: boolean;
    onClick?: (e: React.MouseEvent) => void;
};

function AccordionItem({ userIsEnrolled, href, title, onClick }: AccordionItemProps) {
    const t = useTranslations('accordion');

    return (
        <span title={t(userIsEnrolled ? "module.link_title_enrolled" : "module.link_title_unenrolled")}>
            <Link
                component={NextLink}
                href={userIsEnrolled ? href : "#"}
                variant='h5'
                fontWeight={500}
                underline="always"
                onClick={userIsEnrolled ? onClick : undefined}
                sx={!userIsEnrolled ? { pointerEvents: 'none' } : undefined}
            >
                {title}
            </Link>
        </span>
    );
}