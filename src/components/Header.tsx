import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";
import Avatar from "@mui/material/Avatar";
import { useTranslations } from "next-intl";
import PusakawanLogo from "./PusakawanLogo";
import NextLink from "next/link";
import { useSession } from "next-auth/react";

export default function Header() {
    const t = useTranslations('header');
    const { data: session, status } = useSession();
    return (
        <Box component="header" sx={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 4, px: 12.5, boxShadow: 1

        }}>
            <NextLink href="/" title={t("pusakawan")}>
                <PusakawanLogo />
            </NextLink>
            <Box sx={{ display: 'flex', gap: 3, alignItems: 'center', '&>*': { fontWeight: 500 } }}>
                <HeaderLink href="/challenge" title={t('challenge')}>{t('challenge')}</HeaderLink>
                <HeaderLink href="/program" title={t('program')}>{t('program')}</HeaderLink>
                <HeaderLink href="/leaderboards" title={t('leaderboards')}>{t('leaderboards')}</HeaderLink>
                <HeaderLink href="/about-us" title={t('about_us')}>{t('about_us')}</HeaderLink>
                <hr style={{ height: '3rem' }} />
                {
                    status === 'loading'
                        ? <Skeleton variant="rectangular" width={220} height={60} />
                        : status === "authenticated"
                            ? <NextLink href="/user" title={t('profile')}>
                                <Box display="flex" gap={2} alignItems="center">
                                    <Typography>{session.user.username}</Typography>
                                    <Avatar alt="user picture" sx={{ bgcolor: 'primary.main' }}
                                        src={session.user.profile_picture ?? undefined}>{session.user.username[0].toUpperCase()}
                                    </Avatar>
                                </Box>
                            </NextLink>
                            : <>
                                <NextLink href="/register"><Typography>{t('register')}</Typography></NextLink>
                                <NextLink href="/login"><Button size="large" variant="contained">{t('login')}</Button></NextLink>
                            </>
                }

            </Box>
        </Box>
    )
}

type HeaderLinkProps = {
    href: string;
    children: string;
    title?: string;
};

function HeaderLink({ href, children, title }: HeaderLinkProps) {
    return <Typography component="p"><NextLink title={title} href={href}>{children}</NextLink></Typography>
};