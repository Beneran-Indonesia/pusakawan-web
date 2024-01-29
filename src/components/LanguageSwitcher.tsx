import type { SxProps, Theme } from "@mui/material";
import ButtonGroup from "@mui/material/ButtonGroup";
import IconButton from "@mui/material/IconButton";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";

export default function LanguageSwitcher({ sx }: { sx?: SxProps<Theme> }) {
    const t = useTranslations('header');
    const router = useRouter();
    const changeLocale = (locale: "en" | "id") => router.push(router.asPath, router.asPath, { locale })
    return (
        <ButtonGroup variant="text" aria-label="change language label" sx={{ ml: 1.5, ...sx }}>
            <IconButton onClick={() => changeLocale("id")}
                color="primary" title={t("menu.language.indonesian")}>
                <span className="fi fi-id" style={{ fontSize: '1rem'}}></span>
            </IconButton>
            <IconButton onClick={() => changeLocale("en")}
                color="primary" title={t("menu.language.english")}>
                <span className="fi fi-us" style={{ fontSize: '1rem'}}></span>
            </IconButton>
        </ButtonGroup>
    )
}