import BreadcrumbsWrapper from "@/components/Breadcrumbs";
import ImageWrapper from "@/components/ImageWrapper";
import api, { getProgramData } from "@/lib/api";
import { useDesktopRatio } from "@/lib/hooks";
import {
  createBearerHeader,
  formatNumberToIdr,
  urlToDatabaseFormatted,
} from "@/lib/utils";
import {
  BreadcrumbLinkProps,
  ProgramData,
  ProgramPricing,
} from "@/types/components";
import { ProfileInput } from "@/types/form";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import FormControlLabel from "@mui/material/FormControlLabel";
import Container from "@mui/material/Container";
import FormControl from "@mui/material/FormControl";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { getSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";
import { useState } from "react";
import AgreementModal from "@/components/AgreementsModal";
import LoadingButton from "@mui/lab/LoadingButton";
import { PaymentPayload, PaymentResponse } from "@/types/payment";

export default function ProgramPayment({
  userData,
  pricing,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const isDesktopRatio = useDesktopRatio();
  const t = useTranslations("pricing");
  const router = useRouter();

  const { program_name: programName } = pricing;
  const [radioAccepted, setRadioAccepted] = useState(false);
  const [tncModalOpen, setTncModalOpen] = useState(false);
  const [isLoading, setisLoading] = useState(false);

  const breadcrumbData: BreadcrumbLinkProps[] = [
    {
      href: "/",
      children: t("breadcrumbs.home"),
      title: t("breadcrumbs.home"),
    },
    {
      href: "/program",
      children: t("breadcrumbs.program"),
      title: t("breadcrumbs.program"),
    },
    {
      href: "/program/" + programName,
      children: programName,
      title: programName,
    },
    {
      href: router.pathname,
      children: t("breadcrumbs.payment"),
      title: t("breadcrumbs.payment"),
      active: true,
    },
  ];

  const programPayment = async () => {
    setisLoading(true);
    const classname = router.query!.name;
    const callbackRoute = `${window.location.origin}/program/${classname}`;

    const payload: PaymentPayload = {
      user: {
        ...userData,
        user_id: userData.id,
      },
      program: {
        program_id: pricing.program_id,
        program_name: pricing.program_name,
      },
      pricing: {
        ...pricing,
        total: pricing.main_price,
        additional_fee: [],
      },
      success_url:
        callbackRoute +
        `?payment=success`,
      failure_url:
        callbackRoute +
        `?payment=failed`,
    };

    try {
      const res = await api.post("/program/payment/storyline/", payload, {
        headers: createBearerHeader(userData.accessToken),
      });

      if (res.status === 201 || res.status === 200) {
        const data: PaymentResponse = res.data;
        const { invoice_url } = data;
        router.push(invoice_url);
      }
    } catch (e) {
      console.error("error: ", e);
    } finally {
      setisLoading(false);
    }
  };

  function PriceWrapper({
    classname,
    title,
    price,
    total = false,
  }: {
    classname?: string;
    title: string;
    price?: number;
    total?: boolean;
  }) {
    return price && price > 0 ? (
      <Box display="flex" justifyContent="space-between">
        <Typography variant="h5" component="h5" fontWeight={total ? 600 : 400}>
          {title}
          {": "}
          <b>{classname ?? null}</b>
        </Typography>
        <Typography variant="h5" component="h5" fontWeight={total ? 600 : 400}>
          Rp {formatNumberToIdr(price)}
        </Typography>
      </Box>
    ) : null;
  }

  return (
    <Container sx={{ mt: 7, position: "relative", mb: isDesktopRatio ? 7 : 3 }}>
      <BreadcrumbsWrapper breadcrumbData={breadcrumbData} />
      <Box
        display="flex"
        mt={3}
        gap={2}
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <Typography variant="h4" component="h1" sx={{ mt: 3 }} fontWeight={600}>
          {t("title")}
        </Typography>
        <Box display="flex" flexDirection="column" boxShadow={1} gap={2} p={3}>
          <Typography variant="h5" component="h5" fontWeight={600}>
            {t("method")}
          </Typography>
          <ImageWrapper
            src="/assets/images/xendit_payment.png"
            alt="Automatic payment with Xendit"
            width={300}
            height={48}
          />
          <Typography variant="h5" component="h5" fontWeight={500}>
            {t("detail")}
          </Typography>
          <PriceWrapper
            title={t("price")}
            classname={pricing.program_name}
            price={pricing.main_price}
          />
          <PriceWrapper
            title={t("additional")}
            price={pricing.additional_fee}
          />
          <PriceWrapper
            title={t("total")}
            price={pricing.total_price}
            total={true}
          />

          <TNCAgreeRadio
            radioValue={radioAccepted}
            setRadioValue={setRadioAccepted}
            setModalOpen={() => setTncModalOpen(true)}
          />
          <AgreementModal
            type="T&C"
            open={tncModalOpen}
            handleClose={() => setTncModalOpen(false)}
          />
          <LoadingButton
            variant="contained"
            size="large"
            disabled={!radioAccepted}
            onClick={programPayment}
            loading={isLoading}
          >
            {t("enroll")}
          </LoadingButton>
        </Box>
      </Box>
    </Container>
  );
}

type TNCAgreeRadioProps = {
  radioValue: boolean;
  setRadioValue: (value: boolean) => void;
  setModalOpen: () => void;
};

function TNCAgreeRadio({
  radioValue,
  setRadioValue,
  setModalOpen,
}: TNCAgreeRadioProps) {
  const t = useTranslations("pricing");

  return (
    <FormControl>
      <RadioGroup
        row
        aria-labelledby="terms-and-condition-agreement"
        name="tnc-radio"
        value={radioValue}
        defaultValue={false}
        defaultChecked={false}
        onClick={() => setRadioValue(!radioValue)}
      >
        <FormControlLabel
          value={true}
          control={<Radio />}
          label={t.rich("agreements", {
            red: (chunks) => (
              <Box component="span" color="primary.main" onClick={setModalOpen}>
                {chunks}
              </Box>
            ),
          })}
        />
      </RadioGroup>
    </FormControl>
  );
}

type ProgramPaymentProps = {
  userData: Pick<ProfileInput, "accessToken" | "full_name" | "email" | "id">;
  pricing: ProgramPricing;
};

// type PaymentQuery = {
//   failed: "paymentFailed",
//   success: "paymentSuccess"
// }

export const getServerSideProps: GetServerSideProps<
  ProgramPaymentProps
> = async (ctx) => {
  const { locale, params } = ctx;

  const session = await getSession(ctx);

  // checks if user is logged in
  if (!session) {
    return { notFound: true };
  }

  // checks if program exists
  const classname = urlToDatabaseFormatted(params!.name as string);
  const programRes = await getProgramData(classname);
  if (
    !programRes ||
    programRes.status !== 200 ||
    programRes.message.length === 0
  ) {
    return { notFound: true };
  }

  // checks if user is enrolled in class
  const userEnrolledPrograms = session.user.enrolledPrograms;
  const programData: ProgramData = programRes.message[0];
  const userEnrolled = !!userEnrolledPrograms.find(
    (program) => program.id == programData.id
  );

  if (userEnrolled) {
    return { notFound: true };
  }

  const programPrice = programData.price;
  const additionalFee = 0;
  const uniqueCodeFee = 0;
  const totalPrice = programData.price + additionalFee + uniqueCodeFee;

  const pricing: ProgramPricing = {
    program_id: programData.id,
    program_name: classname,
    main_price: programPrice,
    additional_fee: additionalFee,
    unique_code: uniqueCodeFee,
    total_price: totalPrice,
  };

  // Checking if user has paid this program ->

  return {
    props: {
      pricing,
      userData: {
        accessToken: session.user.accessToken,
        full_name: session.user.full_name,
        email: session.user.email,
        id: session.user.id,
      },
      messages: (await import(`../../../locales/${locale}.json`)).default,
      // testData: [{ title: "pretest", href: "/pretest" }, { title: "posttest", href: "/posttest" }],
    },
  };
};
