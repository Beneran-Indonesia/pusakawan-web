type BreadcrumbLinkProps = {
    href: string, children: string, active?: boolean, title?: string
}

type STATUS = "NONACTIVE" | "ACTIVE" | "DRAFT";

type ProgramPricing = {
    program_id: number;
    program_name: string;
    main_price: number;
    unique_code?: number;
    additional_fee?: number;
    total_price: number;
}

type TestSubmissions = {
    id: number;
    enrollment: number;
    test: number;
    submitted_at: Date;
    is_passed: boolean;
    final_score: number;
}

type ProgramData = {
    program_id: number;
    enrollment_id: number;
    id: number;
    status: STATUS;
    title: string;
    banners: { id: number; image: string; }[]
    description: string;
    price: number;
    pusaka_points: number;
    test_submissions?: TestSubmissions;
}

type SimpleModuleData = {
    title: string;
    href: string;
    // testTitle?: string;
};

type TestItem = {
    id: number;
    test_type: "POST" | "PRE" | string;
    passing_score: number;
    questions: TestData[];
}

type ModuleData = {
    id: number;
    title: string;
    storyline_path: string;
    additional_url: string;
    additional_url_custom_name: string;
    additional_url_section_name: string;
    description: string;
    can_posttest: false
    is_postest: false
    test?: TestItem[];
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
    id: number;
    enrolledPrograms: ProgramData[]
}; // | [] ; // TODO: put the empty array because it's possible user has no enrolled program

type TestData = {
    id: number;
    question: string;
    choice_a: string;
    choice_b: string;
    choice_c: string;
    choice_d: string;
    correct_answer: "A" | "B" | "C" | "D";
};

type TestAnswer = {
    test_question: number;
    selected_answer: string;
};

type SubmitTestResponse = {
    message: string;
    passing_score: number;
    final_score: number;
    is_passed: boolean;
    total_correct: number;
    total_questions: number;
    graded_answers: {
        question_id: number;
        question: string;
        selected_answer: string;
        is_correct: boolean;
    }[];
    can_view_submission: boolean;
    attempt_info: {
        attempts_used: number;
        max_attempt: number;
        can_try_again: boolean;
    };
}

export type {
    SimpleModuleData,
    BreadcrumbLinkProps,
    ProgramPricing,
    ProgramData,
    SortBy,
    ModuleData,
    EnrolledProgram,
    TestData,
    TestItem,
    TestAnswer,
    SubmitTestResponse
}