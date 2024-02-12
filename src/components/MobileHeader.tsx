import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Menu, { MenuProps } from '@mui/material/Menu';
import PusakawanLogo from './PusakawanLogo';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import MenuList from '@mui/material/MenuList';
import Typography from '@mui/material/Typography';
import NextLink from "next/link";
import { useTranslations } from 'next-intl';
import { signOut, useSession } from 'next-auth/react';
import MenuItem from '@mui/material/MenuItem';
import { styled } from '@mui/material/styles';
import ImageWrapper from './ImageWrapper';
import PusakaPoints from "@svgs/logo.svg";
import Link from '@mui/material/Link';
import Divider from "@mui/material/Divider";
import ChangeLanguageButtons from "./LanguageSwitcher";
import LogoutIcon from '@mui/icons-material/Logout';
import Button from "@mui/material/Button";
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';

export default function MobileHeader() {
    const t = useTranslations('header');
    const [open, setOpen] = React.useState(false);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const anchorRef = React.useRef<HTMLButtonElement>(null);
    const { data: session, status } = useSession();


    const handleToggle = () => setOpen((prevOpen) => !prevOpen);

    const handleMenuBarClose = (event: Event | React.SyntheticEvent) => {
        if (
            anchorRef.current &&
            anchorRef.current.contains(event.target as HTMLElement)
        ) {
            return;
        }

        setOpen(false);
    };

    function handleListKeyDown(event: React.KeyboardEvent) {
        if (event.key === 'Escape') {
            setOpen(false);
        }
    }

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
    const handleProfileMenuClose = () => setAnchorEl(null);

    return (
        <AppBar position="sticky">
            <Toolbar sx={{ height: "64px", bgcolor: "white", color: "primary.main" }}>
                <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="navbar-menu-icon"
                    onClick={handleToggle}
                    ref={anchorRef}
                >
                    <MenuIcon />
                </IconButton>
                <Box component="span" sx={{ flexGrow: 1 }}>
                    <PusakawanLogo />
                </Box>
                <div>
                    <IconButton
                        size="small"
                        aria-label="account of current user"
                        aria-controls="account=menu"
                        aria-haspopup="true"
                        onClick={handleMenu}
                        sx={{ color: "white", boxShadow: 1 }}
                    >
                        <PersonOutlineOutlinedIcon sx={{ color: "black" }} />
                    </IconButton>
                    <HeaderMenu
                        id="account=menu"
                        anchorEl={anchorEl}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        open={Boolean(anchorEl)}
                        onClose={handleProfileMenuClose}
                        MenuListProps={{
                            'aria-labelledby': 'header-button',
                        }}
                    >
                        {
                            status === "authenticated"
                                ?
                                <>
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
                                        <MenuItem onClick={handleProfileMenuClose}>
                                            <PersonOutlineIcon fontSize="medium" />
                                            {t("menu.profile")}
                                        </MenuItem>
                                    </Link>
                                    <MenuItem onClick={() => {
                                        handleProfileMenuClose();
                                        signOut({ callbackUrl: '/' });
                                    }}
                                        title={t("sign_out")}
                                    >
                                        <LogoutIcon fontSize="medium" />
                                        {t("menu.sign_out")}
                                    </MenuItem>
                                    <Divider />
                                    <ChangeLanguageButtons />
                                </>
                                : <>
                                    <MenuItem sx={{ justifyContent: "center" }}>
                                        <NextLink href="/register"><Typography>{t('register')}</Typography></NextLink>
                                    </MenuItem>
                                    <MenuItem>
                                        <Button size="small" variant="contained" href="/login">{t('login')}</Button>
                                    </MenuItem>
                                </>
                        }
                    </HeaderMenu>
                </div>
            </Toolbar>
            <MenuOpen open={open} anchorRef={anchorRef} handleListKeyDown={handleListKeyDown} handleMenuBarClose={handleMenuBarClose} />
        </AppBar>
    );
}

type MenuOpenProps = {
    open: boolean;
    anchorRef: React.RefObject<HTMLButtonElement>;
    handleListKeyDown: (event: React.KeyboardEvent) => void;
    handleMenuBarClose: (event: Event | React.SyntheticEvent) => void;
}

function MenuOpen({ open, anchorRef, handleListKeyDown, handleMenuBarClose }: MenuOpenProps) {
    const t = useTranslations('header');
    return (
        <Popper
            open={open}
            anchorEl={anchorRef.current}
            role={undefined}
            placement="bottom-start"
            transition
            disablePortal
            sx={{
                width: "100%",
                bgcolor: "white",
                maxHeight: 'unset',
                maxWidth: 'unset',
                boxShadow: 1,
            }}
        >
            {({ TransitionProps, placement }) => (
                <Grow
                    {...TransitionProps}
                    style={{
                        transformOrigin:
                            placement === 'bottom-start' ? 'left top' : 'left bottom',
                    }}
                >
                    <Paper>
                        <ClickAwayListener onClickAway={handleMenuBarClose}>
                            <MenuList
                                id="navbar-menu"
                                aria-labelledby="composition-button"
                                onKeyDown={handleListKeyDown}
                                sx={{ '&>*': { fontWeight: 500 } }}
                            >
                                <MenuItem>
                                    <HeaderLink href="/challenge" title={t('challenge')}>{t('challenge')}</HeaderLink>
                                </MenuItem>
                                <MenuItem>
                                    <HeaderLink href="/program" title={t('program')}>{t('program')}</HeaderLink>
                                </MenuItem>
                                <MenuItem>
                                    <HeaderLink href="/leaderboards" title={t('leaderboards')}>{t('leaderboards')}</HeaderLink>
                                </MenuItem>
                                <MenuItem>
                                    <HeaderLink href="/about-us" title={t('about_us')}>{t('about_us')}</HeaderLink>
                                </MenuItem>
                            </MenuList>
                        </ClickAwayListener>
                    </Paper>
                </Grow>
            )}
        </Popper>
    )
}

type HeaderLinkProps = {
    href: string;
    children: string;
    title?: string;
};


function HeaderLink({ href, children, title }: HeaderLinkProps) {
    return <Typography component="p"><NextLink title={title} href={href}>{children}</NextLink></Typography>
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
    />
))(({ theme }) => ({
    '& .MuiPaper-root': {
        borderRadius: 6,
        marginTop: theme.spacing(1),
        // TODO:
        minWidth: theme.breakpoints.up("md") ? 180 : "auto",
        width: theme.breakpoints.up("md") ? "auto" : "fit-content",
        boxShadow:
            'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
        '& .MuiMenu-list': {
            padding: '4px 0',
        },

        '& .MuiMenuItem-root': {
            '& .MuiSvgIcon-root': {
                marginRight: theme.breakpoints.up("md") ? theme.spacing(1.5) : 0,
            },

        },

    },
}));