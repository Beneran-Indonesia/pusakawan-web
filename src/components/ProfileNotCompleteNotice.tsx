import NoticeBar from "@/components/Notice";
import Link from "@mui/material/Link";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import Box from "@mui/material/Box";

type NoticeProps = {
    type?: "profile" | "default"
}

export default function ProfileNotCompleteNotice({ type = "default" }: NoticeProps) {
    const { data: session, status } = useSession();
    const authenticated = status === "authenticated";
    const profileCompleted = authenticated && session.user.is_profile_complete;
    const t = useTranslations("notice_bar");
    return (
        session && !profileCompleted ? (
            <NoticeBar>
                {t.rich(type, {
                    'red': (chunks) => <Box component="span" color="primary.main">{chunks}</Box>,
                    'link': (chunks) => <Link href="/user">{chunks}</Link>,
                })}
            </NoticeBar>
        ) : null
    );
}