import BreadcrumbsWrapper from "@/components/Breadcrumbs";
import ImageWrapper from "@/components/ImageWrapper";
import { getPricingData } from "@/lib/api";
import { useDesktopRatio } from "@/lib/hooks";
import { formatNumberToIdr, urlToDatabaseFormatted } from "@/lib/utils";
import { BreadcrumbLinkProps, ProgramPricing } from "@/types/components";
import { ProfileInput } from "@/types/form";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import FormControlLabel from "@mui/material/FormControlLabel";
import Container from "@mui/material/Container";
import FormControl from "@mui/material/FormControl";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Button from "@mui/material/Button";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { getSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";
import { useState } from "react";
import AgreementModal from "@/components/AgreementsModal";

export default function ProgramPayment({
  // userData,
  pricing,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const isDesktopRatio = useDesktopRatio();
  const t = useTranslations("pricing");
  const router = useRouter();
  const { program_name: programName } = pricing;
  const [radioAccepted, setRadioAccepted] = useState(false);
  const [tncModalOpen, setTncModalOpen] = useState(false);

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

  function PriceWrapper({
    title,
    price,
    total = false,
  }: {
    title: string;
    price: number;
    total?: boolean;
  }) {
    return (
      <Box display="flex" justifyContent="space-between">
        <Typography variant="h5" component="h5" fontWeight={total ? 600 : 400}>
          {title}
        </Typography>
        <Typography variant="h5" component="h5" fontWeight={total ? 600 : 400}>
          {formatNumberToIdr(price)}
        </Typography>
      </Box>
    );
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
          <PriceWrapper title={t("price")} price={pricing.main_price} />
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
          <Button variant="contained" size="large" disabled={!radioAccepted}>{t("enroll")}</Button>
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

  const someString = "";

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

export const getServerSideProps: GetServerSideProps<
  ProgramPaymentProps
> = async (ctx) => {
  const { locale, params } = ctx;

  const session = await getSession(ctx);

  // checks if user is logged in
  if (!session) {
    return { notFound: true };
  }

  // const userId = session.user.id;

  const classname = urlToDatabaseFormatted(params!.name as string);

  // TODO: backend create a payment that checks 1. user is enrolled to the program (search by name + email + status = active) ?
  // !! expected data already put at api.ts

  const programPricingReq = await getPricingData(classname, session.user.email);

  // checks if program exists
  if (
    !programPricingReq ||
    programPricingReq.status !== 200 ||
    programPricingReq.message.length === 0
  ) {
    return { notFound: true };
  }

  return {
    props: {
      userData: {
        accessToken: session.user.accessToken,
        full_name: session.user.full_name,
        email: session.user.email,
        id: session.user.id,
      },
      messages: (await import(`../../../locales/${locale}.json`)).default,
      // testData: [{ title: "pretest", href: "/pretest" }, { title: "posttest", href: "/posttest" }],
      pricing: programPricingReq.message,
    },
  };
};
