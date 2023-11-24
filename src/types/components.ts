type BreadcrumbLinkProps = {
    href: string, children: string, active?: boolean, title?: string
}

type BreadcrumbProps = {
    breadcrumbData: ({ id: string } & BreadcrumbLinkProps)[];
}

type ProgramData = {
    id: number;
    img: string;
    title: string;
    paid: boolean;
    price?: number;
}

export type { 
    BreadcrumbProps,
    BreadcrumbLinkProps,
    ProgramData,
}