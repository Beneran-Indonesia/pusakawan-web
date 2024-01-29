type BreadcrumbLinkProps = {
    href: string, children: string, active?: boolean, title?: string
}

type STATUS = "NONACTIVE" | "ACTIVE" | "DRAFT"

type ProgramData = {
    id: number;
    status: STATUS;
    title: string;
    banners: { id: number; image: string; }[]
    description: string;
    price: number;
    pusaka_points: number;
    // paid: boolean;
}

type ModuleData = {
    id: number;
    title: string;
    storyline_path: string;
    additional_url: string;
    description: string;
    pretest: null | string;
    posttest: null | string;
    // modules: {
    //     description?: string;
    //     items: {
    //         title: string;
    //         href: string;
    //     }[]
    // };
    // assignment: {
    //     description?: string;
    //     items: {
    //         title: string;
    //         href: string;
    //     }[]
    // };
}

type SortBy = 'ALL' | 'PAID' | 'FREE';

type EnrolledProgram = {
    enrolledPrograms: ProgramData[]
}

export type {
    BreadcrumbLinkProps,
    ProgramData,
    SortBy,
    ModuleData,
    EnrolledProgram
}