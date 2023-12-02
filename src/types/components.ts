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

type ClassOverview = ProgramData & {
    description: string;
    pusakaPoints: number;
    pretest: null | string;
    posttest: null | string;
    modules: {
        description?: string;
        items: {
            title: string;
            href: string;
        }[]
    };
    assignment: {
        description?: string;
        items: {
            title: string;
            href: string;
        }[]
    };
}

type SortBy = 'ALL' | 'PAID' | 'FREE';


export type {
    BreadcrumbProps,
    BreadcrumbLinkProps,
    ProgramData,
    SortBy,
    ClassOverview
}