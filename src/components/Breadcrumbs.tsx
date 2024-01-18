import * as React from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import NextLink from "next/link";
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { BreadcrumbLinkProps } from '@/types/components';

type BreadcrumbProps = {
    breadcrumbData: BreadcrumbLinkProps[];
}

export default function BreadcrumbsWrapper({ breadcrumbData }: BreadcrumbProps) {
    return (
        <Breadcrumbs aria-label="breadcrumb" separator={<NavigateNextIcon fontSize="small" />} >
            {
                breadcrumbData.map((bc, idx) =>
                    <BreadcrumbLink key={`breadcrumb-${idx}`} href={bc.href} title={bc.title} active={bc.active}>{bc.children}</BreadcrumbLink>
                )
            }
        </Breadcrumbs>
    );
}

const BreadcrumbLink = ({ href, children, active = false, title }: BreadcrumbLinkProps) =>
    <Link component={NextLink} href={href} title={title} variant='h5' fontWeight={500}
        underline="hover" aria-current={active ? "page" : undefined} color={active ? "primary.main" : '#230407'}>
        {children}
    </Link>