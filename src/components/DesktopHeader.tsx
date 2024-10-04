import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";
import Avatar from "@mui/material/Avatar";
import { useTranslations } from "next-intl";
import PusakawanLogo from "./PusakawanLogo";
import NextLink from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";
import Divider from "@mui/material/Divider";
import Link from "@mui/material/Link";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import type { MenuProps } from "@mui/material";
import { styled } from '@mui/material/styles';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import ImageWrapper from "./ImageWrapper";
import PusakaPoints from "@svgs/logo.svg";
import ChangeLanguageButtons from "./LanguageSwitcher";
import HeaderLink from "./HeaderLink";

export default function Header() {
    const t = useTranslations('header');
    const { data: session, status } = useSession();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const menuOpen = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => setAnchorEl(event.currentTarget);

    const handleClose = () => setAnchorEl(null);

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
                            ? <>
                                <Box
                                    component="section"
                                    aria-controls={menuOpen ? 'header-menu' : undefined}
                                    aria-haspopup="true"
                                    aria-expanded={menuOpen ? 'true' : undefined}
                                    onClick={handleClick}
                                    sx={{ cursor: "pointer" }}
                                    tabIndex={0}
                                    display="flex" gap={2} alignItems="center">
                                    <Typography>{session.user.username}</Typography>
                                    <Avatar alt="user picture" sx={{ bgcolor: 'primary.main' }}
                                        src={session.user.profile_picture ?? undefined}>{session.user.username[0].toUpperCase()}
                                    </Avatar>
                                </Box>
                                <HeaderMenu
                                    id="header-menu"
                                    anchorEl={anchorEl}
                                    open={menuOpen}
                                    onClose={handleClose}
                                    MenuListProps={{
                                        'aria-labelledby': 'header-button',
                                    }}
                                >
                                    <MenuItem title={t("points")} selected={false}>
                                        <ImageWrapper src={PusakaPoints}
                                            alt="Pusaka points logo"
                                            width={22} height={22}
                                            style={{ marginRight: 14 }}
                                        />
                                        {session.user.pusaka_points} {t("menu.point")}
                                    </MenuItem>
                                    <Link href="/user" title={t("profile")} tabIndex={0}
                                        sx={{ textDecoration: 'none', color: 'black' }}>
                                        <MenuItem onClick={handleClose}>
                                            <PersonOutlineIcon fontSize="medium" />
                                            {t("menu.profile")}
                                        </MenuItem>
                                    </Link>
                                    <MenuItem onClick={() => {
                                        handleClose();
                                        signOut({ callbackUrl: '/' });
                                    }}
                                        title={t("sign_out")}
                                    >
                                        <LogoutIcon fontSize="medium" />
                                        {t("menu.sign_out")}
                                    </MenuItem>
                                    <Divider />
                                    <ChangeLanguageButtons />
                                </HeaderMenu>
                            </>
                            : <>
                                <NextLink href="/signin"><Button size="large" variant="contained">{t('register')}</Button></NextLink>
                                <NextLink href="/signin"><Button size="large" variant="outlined">{t('login')}</Button></NextLink>
                            </>
                }

            </Box>
        </Box >
    )
}

const HeaderMenu = styled((props: MenuProps) => (
    <Menu
        
        elevation={0}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
        }}
        sx={{ boxShadow: 1 }}
        {...props}
        disableScrollLock={true}
    />
))(({ theme }) => ({
    '& .MuiPaper-root': {
        borderRadius: 6,
        marginTop: theme.spacing(1),
        minWidth: 180,
        boxShadow:
            'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
        '& .MuiMenu-list': {
            padding: '4px 0',
        },

        '& .MuiMenuItem-root': {
            '& .MuiSvgIcon-root': {
                marginRight: theme.spacing(1.5),
            },

        },

    },
}));