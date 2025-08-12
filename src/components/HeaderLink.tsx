import Typography from "@mui/material/Typography";
import NextLink from "next/link";

type HeaderLinkProps = {
  href: string;
  children: string;
  title?: string;
};

export default function HeaderLink({ href, children, title }: HeaderLinkProps) {
  return (
    <Typography component="p">
      <NextLink title={title} href={href}>
        {children}
      </NextLink>
    </Typography>
  );
}
