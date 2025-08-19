type PaymentResponse = {
  invoice_url: string;
};

type PaymentPayload = {
  user: {
    user_id: number;
    full_name: string;
    email: string;
  };
  program: {
    program_id: number;
    program_name: string;
  };
  pricing: {
    total: number;
    main_price: number;
    additional_fee?: { name: string; amount: number }[];
  };
  success_url: string;
  failure_url: string;
};

export type {
  PaymentPayload,
  PaymentResponse
}