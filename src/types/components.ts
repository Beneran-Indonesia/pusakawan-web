type BreadcrumbLinkProps = {
    href: string, children: string, active?: boolean, title?: string
}

type STATUS = "NONACTIVE" | "ACTIVE" | "DRAFT";

type ProgramPricing = {
    program_id: number;
    program_name: string;
    main_price: number;
    unique_code: number;
    additional_fee: number;
    total_price: number;
}

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

type SimpleModuleData = {
    title: string;
    href: string;
    // testTitle?: string;
};

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
};

type TestData = {
    question: string;
    choice_a: string;
    choice_b: string;
    choice_c: string;
    choice_d: string;
    answer: "choice_a" | "choice_b" | "choice_c" | "choice_d";
    score?: number; // default: 100
}

export type {
    SimpleModuleData,
    BreadcrumbLinkProps,
    ProgramPricing,
    ProgramData,
    SortBy,
    ModuleData,
    EnrolledProgram,
    TestData
}