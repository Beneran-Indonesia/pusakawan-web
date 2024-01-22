import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";
import Avatar from "@mui/material/Avatar";
import { useTranslations } from "next-intl";
import PusakawanLogo from "./PusakawanLogo";
import NextLink from "next/link";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { Menu, MenuItem, MenuProps } from "@mui/material";
import { styled, alpha } from '@mui/material/styles';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';

export default function Header() {
    const t = useTranslations('header');
    const { data: session, status } = useSession();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const menuOpen = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

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
                            // TODO: PROFILE MENU
                            ? <>
                                <Box
                                    component="section"
                                    aria-controls={menuOpen ? 'header-menu' : undefined}
                                    aria-haspopup="true"
                                    aria-expanded={menuOpen ? 'true' : undefined}
                                    onClick={handleClick}
                                    sx={{ cursor: "pointer" }}
                                    display="flex" gap={2} alignItems="center">
                                    <Typography>{session.user.username}</Typography>
                                    <Avatar alt="user picture" sx={{ bgcolor: 'primary.main' }}
                                        src={session.user.profile_picture ?? undefined}>{session.user.username[0].toUpperCase()}
                                    </Avatar>
                                    <NextLink href="/user" title={t('profile')}>
                                    </NextLink>
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
                                    <MenuItem onClick={handleClose} disableRipple>{session.user.pusaka_points} Poin</MenuItem>
                                    <MenuItem onClick={handleClose} href="/user" disableRipple>
                                        <PersonOutlineIcon fontSize="medium"/>
                                        Profile
                                    </MenuItem>
                                    <MenuItem onClick={handleClose} href="" disableRipple>
                                        <LogoutIcon fontSize="medium"/>
                                        Keluar
                                    </MenuItem>
                                </HeaderMenu>
                            </>
                            : <>
                                <NextLink href="/register"><Typography>{t('register')}</Typography></NextLink>
                                <NextLink href="/login"><Button size="large" variant="contained">{t('login')}</Button></NextLink>
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
        {...props}
    />
))(({ theme }) => ({
    '& .MuiPaper-root': {
        borderRadius: 6,
        marginTop: theme.spacing(1),
        minWidth: 180,
        boxShadow: 1,
        '& .MuiMenu-list': {
            padding: '4px 0',
        },
        '& .MuiMenuItem-root': {
            '& .MuiSvgIcon-root': {
                marginRight: theme.spacing(1.5),
            },
            '&:active': {
                backgroundColor: "white"
            },
        },
    },
}));

type HeaderLinkProps = {
    href: string;
    children: string;
    title?: string;
};

function HeaderLink({ href, children, title }: HeaderLinkProps) {
    return <Typography component="p"><NextLink title={title} href={href}>{children}</NextLink></Typography>
};