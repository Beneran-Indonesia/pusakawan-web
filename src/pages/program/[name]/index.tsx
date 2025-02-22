import Accordion from "@/components/Accordion/Accordion";
import BreadcrumbsWrapper from "@/components/Breadcrumbs";
import ImageWrapper from "@/components/ImageWrapper";
import api, { getModuleData, getProgram, getProgramData } from "@/lib/api";
import {
  createBearerHeader,
  formatNumberToIdr,
  urlToDatabaseFormatted,
} from "@/lib/utils";
import {
  BreadcrumbLinkProps,
  ModuleData,
  ProgramData,
  SimpleModuleData,
} from "@/types/components";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import Logo from "@svgs/logo.svg";
import { getRandomCoursePicture } from "@/lib/constants";
import { useState } from "react";
import Modal from "@/components/Modal";
import LoadingButton from "@mui/lab/LoadingButton";
import Alert from "@mui/material/Alert";
import Tooltip from "@mui/material/Tooltip";
import Snackbar from "@mui/material/Snackbar";
import ProfileNotCompleteNotice from "@/components/ProfileNotCompleteNotice";
import Head from "next/head";
import { useDesktopRatio } from "@/lib/hooks";

export default function NameClass({
  classname,
  programData,
  moduleData,
  assignment,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);

  const [enrollLoading, setEnrollLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState({
    open: false,
    success: false,
    message: "",
  });

  const handleSnackbar = (open: boolean, success: boolean, message: string) =>
    setSnackbarOpen({ open, success, message });
  const handleSnackbarClose = () =>
    setSnackbarOpen({ ...snackbarOpen, open: false });
  const toggleModalOpen = () =>
    setConfirmationModalOpen(!confirmationModalOpen);

  const { data: session, status, update } = useSession();
  const t = useTranslations("class.overview");
  const router = useRouter();

  const userIsEnrolled =
    status === "authenticated" &&
    session.user.enrolledPrograms.some(
      (program) => program.id === programData.id
    );

  const user = { id: session?.user.id, accessToken: session?.user.accessToken };
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
      href: router.pathname,
      children: programData.title,
      title: programData.title,
      active: true,
    },
  ];

  const userIsUnauthenticated = status === "unauthenticated";
  const userProfileNotCompleted =
    (!userIsUnauthenticated && session && !session.user.is_profile_complete) ??
    true;

  const {
    title,
    description,
    banners,
    pusaka_points: pusakaPoints,
    price,
  } = programData;
  const paid = price > 0;

  async function enrollUser(
    userId: number,
    programId: number,
    sessionToken: string
  ) {
    setEnrollLoading(true);
    try {
      const res = await api.post(
        process.env.NEXT_PUBLIC_API_URL + "/program/enrollment/",
        {
          program: programId,
          participant: userId,
        },
        { headers: createBearerHeader(sessionToken) }
      );
      setEnrollLoading(false);
      if (res.status === 201) {
        setEnrollLoading(false);
        handleSnackbar(true, true, t("snackbar.success"));

        const programId = res.data.program;
        const enrolledProgram = (await getProgram(programId))?.message;

        if (enrolledProgram) {
          await update({
            ...session!,
            user: {
              enrolledPrograms: [
                ...session!.user.enrolledPrograms,
                ...enrolledProgram,
              ],
            },
          });
          toggleModalOpen();
          return { status: res.status, message: res.data };
        }

        throw new Error("Failed to fetch enrolled program details");
      }

      toggleModalOpen();
      handleSnackbar(true, false, t("snackbar.error.server"));
      setEnrollLoading(false);
      return;
    } catch (e) {
      console.error("ENROLL USER ERROR:", e);
      setEnrollLoading(false);
      handleSnackbar(true, false, t("snackbar.error.client"));
    }
  }

  const isDesktopRatio = useDesktopRatio();

  return (
    <>
      <Head>
        <title>{classname}</title>
      </Head>
      <ProfileNotCompleteNotice />
      <Box
        sx={{
          pt: 4,
          background: `linear-gradient(rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5)), url(${banners[0].image})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "0 45%",
          height: 345,
          position: "relative",
        }}
      >
        <Container>
          <BreadcrumbsWrapper breadcrumbData={breadcrumbData} />
        </Container>
        <BlurBox />
      </Box>

      <Snackbar
        open={snackbarOpen.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarOpen.success ? "success" : "error"}
          sx={{ width: "100%" }}
        >
          {snackbarOpen.message}
        </Alert>
      </Snackbar>

      <Container sx={{ mt: -6, position: "relative", mb: 10 }}>
        <Box display="flex" flexDirection="column" gap={2}>
          <Typography variant="h2" component="h2" fontWeight={600}>
            {title}
          </Typography>
          <Box display="flex">
            <Box>
              {userIsEnrolled ? null : (
                <Button
                  variant="contained"
                  size={"medium"}
                  sx={{ textAlign: "center", mr: isDesktopRatio ? 4 : 1 }}
                  disabled={userIsUnauthenticated || userProfileNotCompleted}
                  onClick={toggleModalOpen}
                >
                  {paid ? (
                    <>
                      {t("button.paid")}
                      <Typography
                        ml={1}
                        variant={isDesktopRatio ? "h4" : "h5"}
                        component="span"
                      >
                        Rp. {formatNumberToIdr(price)}
                      </Typography>
                    </>
                  ) : (
                    t("button.free")
                  )}
                </Button>
              )}
              {userIsUnauthenticated ? (
                <Typography variant="h6" color="primary.main" mt={0.5}>
                  {t("error.unauthenticated")}
                </Typography>
              ) : userProfileNotCompleted ? (
                <Typography variant="h6" color="primary.main" mt={0.5}>
                  {t("error.profile_not_complete")}
                </Typography>
              ) : null}
            </Box>
            <Box
              display="flex"
              boxShadow={1}
              height="40px"
              width="170px"
              px={1.5}
              py={1}
              borderRadius={2}
              gap={1.5}
              alignItems="center"
            >
              <ImageWrapper
                src={Logo}
                width={15}
                height={21}
                alt="pusakawan logo"
              />
              <Typography fontWeight={500}>
                {pusakaPoints} {t("points")}
              </Typography>
              <Tooltip
                title={t("pusaka_points_details")}
                arrow
                placement="top-end"
              >
                <HelpOutlineIcon width={18} sx={{ ml: "auto" }} />
              </Tooltip>
            </Box>
          </Box>
          <Typography variant="h5" component="h5" fontWeight={600}>
            {t("description")}
          </Typography>
          <Typography mb={2}>{description}</Typography>
          {/* Apparently no description.. */}
          <Accordion
            isModule={true}
            items={moduleData}
            userIsEnrolled={userIsEnrolled}
          />

          <Accordion
            isModule={false}
            items={assignment}
            userIsEnrolled={userIsEnrolled}
          />

          {!paid ? null : (
            <>
              <Typography
                variant="h4"
                component="h4"
                fontWeight={600}
                mt={3}
                mb={1}
              >
                {t("price_title")}
              </Typography>
              <PaidClassCard price={price} />
            </>
          )}
        </Box>
      </Container>
      {/* Confirmation Modal */}
      <Modal
        isOpen={confirmationModalOpen}
        toggleOpen={enrollLoading ? undefined : toggleModalOpen}
      >
        <Typography fontWeight={600}>{t("modal.description")}</Typography>
        <Box display="flex" gap={4}>
          <Button
            disabled={enrollLoading}
            variant="contained"
            size="large"
            sx={{
              bgcolor: "whitesmoke",
              color: "primary.main",
              "&:hover": {
                backgroundColor: "#fbfbfb",
                color: "primary.main",
              },
            }}
            onClick={toggleModalOpen}
          >
            {t("modal.cancel")}
          </Button>
          <LoadingButton
            loading={enrollLoading}
            variant="contained"
            size="medium"
            onClick={() =>
              enrollUser(
                user.id as number,
                programData.id,
                user.accessToken as string
              )
            }
          >
            {t("modal.confirm")}
          </LoadingButton>
        </Box>
      </Modal>
    </>
  );
}

type PaidClassCardProps = {
  price: number;
};

function PaidClassCard({ price }: PaidClassCardProps) {
  const t = useTranslations("class.paid_card");
  const router = useRouter();
  const paymentLink = router.asPath + "/payment";

  function PointsTypography({ content }: { content: string }) {
    return (
      <li>
        <Typography
          variant="h5"
          component="h5"
          fontWeight={500}
          sx={{ display: "inline" }}
        >
          {content}
        </Typography>
      </li>
    );
  }

  return (
    <Box
      sx={{
        boxShadow: 1,
        maxWidth: 378,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        py: 3,
        px: 2,
      }}
    >
      <Typography variant="h5" component="h5" fontWeight={500}>
        {t("title")}
      </Typography>
      <Typography variant="h3" component="span" fontWeight={600}>
        Rp. {formatNumberToIdr(price)}
      </Typography>
      <Typography variant="h5" component="h5" color="monochrome.two">
        {t("subtitle")}
      </Typography>

      <Box sx={{ lineHeight: "180%" }}>
        <PointsTypography content={t("points.first")} />
        <PointsTypography content={t("points.second")} />
        <PointsTypography content={t("points.third")} />
      </Box>

      <Button
        variant="contained"
        size="large"
        sx={{ mt: 2 }}
        title={t("button.title")}
        href={paymentLink}
      >
        {t("button.title")}
      </Button>
    </Box>
  );
}

function BlurBox() {
  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        width: "100%",
        height: "10.5rem",
        background:
          "linear-gradient(0deg, #FFF 21.66%, rgba(255, 255, 255, 0.40) 66.91%, rgba(255, 255, 255, 0.00) 100%)",
      }}
    />
  );
}

type ClassDatas = {
  classname: string;
  programData: ProgramData;
  moduleData: SimpleModuleData[];
  messages: string;
  assignment: SimpleModuleData[] | null;
};

export const getServerSideProps: GetServerSideProps<ClassDatas> = async (
  ctx
) => {
  const { locale, params, resolvedUrl } = ctx;
  const classname = urlToDatabaseFormatted(params!.name as string);
  const programDataReq = await getProgramData(classname);

  if (!programDataReq || programDataReq.message.length === 0) {
    return { notFound: true };
  }

  let programData = programDataReq.message[0] as ProgramData;
  const programId = programData.id;

  if (programData.banners.length === 0) {
    const defaultBanner = [{ id: 1, image: getRandomCoursePicture() }];
    programData = { ...programData, banners: defaultBanner };
  }
  const moduleRes = await getModuleData(programId.toString());

  let modules = [{ title: "", href: "" }];
  let assignment = null;

  if (moduleRes) {
    const moduleData = moduleRes.message as ModuleData[];
    modules = moduleData.map((mdl) => ({
      title: mdl.title,
      href: resolvedUrl + "/learn",
    }));

    assignment = moduleData
      .filter((mdl) => mdl.additional_url)
      .map((mdl) => ({ title: mdl.title, href: mdl.additional_url }));
  }

  return {
    props: {
      classname,
      programData,
      moduleData: modules,
      assignment,
      messages: (await import(`../../../locales/${locale}.json`)).default,
    },
  };
};
