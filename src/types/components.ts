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

type SortBy = 'ALL' | 'PAID' | 'FREE';


export type { 
    BreadcrumbProps,
    BreadcrumbLinkProps,
    ProgramData,
    SortBy
}