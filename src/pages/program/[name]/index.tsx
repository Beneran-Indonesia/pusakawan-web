import ModuleAccordion from "@/components/Accordion/Accordion";
import BreadcrumbsWrapper from "@/components/Breadcrumbs";
import ImageWrapper from "@/components/ImageWrapper";
import api, {
  getModuleData,
  getProgramData,
  createCertificate,
} from "@/lib/api";
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
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import Logo from "@svgs/logo.svg";
import { useSession } from "next-auth/react";
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
import { generateCertificate } from "@/lib/generateCertificate";

export default function NameClass({
  classname,
  programData,
  moduleData,
  assignment,
  testData,
  assignmentTitle,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  let enrollmentId: number | null = null;
  let userEnrolled: boolean = false;
  let userPassedPostTest: boolean = false;

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
  const user = { id: session?.user.id, accessToken: session?.user.accessToken };
  // Ambil data user enrolled

  if (session) {
    const enrolled =
      Array.isArray(session.user.enrolledPrograms) &&
      session.user.enrolledPrograms.find(
        (program) => program.id === programData.id
      );

    if (enrolled !== false && enrolled !== undefined) {
      enrollmentId = enrolled.enrollment_id;
      userEnrolled = true;
    }
    userPassedPostTest = !!session.user.enrolledPrograms.find(
      (program) => program.id === programData.id
    )?.test_submissions?.is_passed;
  }
  const t = useTranslations("class.overview");
  const router = useRouter();

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
    status !== "loading" &&
    !!(!userIsUnauthenticated && session && !session.user.is_profile_complete);

  const {
    title,
    description,
    banners,
    pusaka_points: pusakaPoints,
    price,
  } = programData;
  const programPaid = price > 0;

  // handle sertifikat
  const handleDownloadCertificate = async () => {
    try {
      if (!enrollmentId) {
        handleSnackbar(true, false, t("certificate.error.enrollment_id"));
        return;
      }

      if (session === null || userIsUnauthenticated) {
        handleSnackbar(true, false, t("certificate.error.session_expired"));
        router.push("/signin");
        return;
      }

      if (!userPassedPostTest) {
        handleSnackbar(true, false, t("certificate.error.post_test"));
        return;
      }

      const certificateResponse = await createCertificate(
        enrollmentId,
        session.user.accessToken
      );

      if (
        certificateResponse.status === 200 ||
        certificateResponse.status === 201
      ) {
        const certificateData = {
          participant_name: certificateResponse.data.participant_name,
          program_name: certificateResponse.data.program_name,
          certificate_sequence: certificateResponse.data.certificate_sequence,
          year: certificateResponse.data.year.toString(),
          user_id: session.user.id.toString(),
        };

        // console.log("Certificate data:", certificateData);

        // Generate sertifikat
        const certificate = await generateCertificate(certificateData);

        // Convert the Uint8Array to a proper Blob
        const blob = new Blob([new Uint8Array(certificate)], {
          type: "application/pdf",
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;

        // Nama file sertifikat
        const fileName = `certificate_${certificateData.participant_name.replace(
          /\s+/g,
          "_"
        )}_${certificateData.certificate_sequence}.pdf`;
        link.download = fileName;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(url);

        handleSnackbar(true, true, t("certificate.succeed"));
      } else {
        handleSnackbar(true, false, t("certificate.failed"));
      }
    } catch (err) {
      console.error("Error downloading certificate:", err);
      handleSnackbar(true, false, t("certificate.error.post_test"));
    }
  };

  async function enrollUser(
    userId: number,
    programId: number,
    sessionToken: string
  ) {
    setEnrollLoading(true);
    try {
      const res = await api.post(
        "/program/enrollment/",
        {
          program: programId,
          participant: userId,
        },
        { headers: createBearerHeader(sessionToken) }
      );
      setEnrollLoading(false);

      if (res.status === 201) {
        handleSnackbar(true, true, t("snackbar.success"));
        const enrollmentId = res.data.id; // id enrollment
        await update({
          ...session!,
          user: {
            ...session!.user,
            enrolledPrograms: [
              ...session!.user.enrolledPrograms,
              {
                ...programData,
                enrollment_id: enrollmentId,
              },
            ],
          },
        });
        toggleModalOpen();
        return { status: res.status, message: res.data };
      }

      toggleModalOpen();
      handleSnackbar(true, false, t("snackbar.error.server"));
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
          <Box
            display="flex"
            flexDirection={isDesktopRatio ? "row" : "column"}
            gap={isDesktopRatio ? 0 : 2}
          >
            <Box>
              {userEnrolled ? null : (
                <Button
                  variant="contained"
                  size={"medium"}
                  sx={{ textAlign: "center", mr: isDesktopRatio ? 4 : 1 }}
                  disabled={userIsUnauthenticated || userProfileNotCompleted}
                  onClick={
                    programPaid
                      ? () => router.push(router.asPath + "/payment")
                      : toggleModalOpen
                  }
                >
                  {programPaid ? (
                    <>
                      <Typography
                        variant={isDesktopRatio ? "h4" : "h5"}
                        component="span"
                      >
                        {`${t("button.paid")}  Rp. ${formatNumberToIdr(price)}`}
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

          {/* download certificate */}
          {userEnrolled && (
            <Box
              sx={{
                mb: 2,
                display: "flex",
                justifyContent: "flex-start",
                flexDirection: "column",
                width: "fit-content",
              }}
            >
              <Button
                variant="contained"
                size="large"
                onClick={handleDownloadCertificate}
                disabled={!userPassedPostTest}
                title={t(
                  !userPassedPostTest
                    ? "button.title_disabled"
                    : "button.title_enabled"
                )}
              >
                {t("button.download_certificate")}
              </Button>
              {!userPassedPostTest ? (
                <Typography variant="h6" color="primary.main" mt={0.5}>
                  {t("button.title_disabled")}
                </Typography>
              ) : null}
            </Box>
          )}

          {/* Module Accordion */}
          <ModuleAccordion
            isModule={true}
            items={moduleData}
            userIsEnrolled={userEnrolled}
            accordionType="module"
          />

          {/* Assignment Accordion */}
          {assignment && assignment.length > 0 && (
            <ModuleAccordion
              isModule={false}
              items={assignment}
              userIsEnrolled={userEnrolled}
              accordionType="assignment"
              assignmentTitle={assignmentTitle} // nama accordion/konten
            />
          )}

          {/* Post-test Accordion */}
          {testData && testData.length > 0 && (
            <ModuleAccordion
              testDisabled={userPassedPostTest}
              isModule={false}
              items={testData}
              userIsEnrolled={userEnrolled}
              accordionType="post-test"
            />
          )}

          {!programPaid ? null : (
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
              <PaidClassCard
                userIsEnrolled={userEnrolled}
                buttonDisabled={
                  userIsUnauthenticated || userProfileNotCompleted
                }
                price={price}
              />
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
              enrollUser(user.id!, programData.id, user.accessToken!)
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
  buttonDisabled: boolean;
  userIsEnrolled: boolean;
};

function PaidClassCard({
  buttonDisabled,
  userIsEnrolled,
  price,
}: PaidClassCardProps) {
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

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1,
          lineHeight: "180%",
        }}
      >
        <PointsTypography content={t("points.first")} />
        <PointsTypography content={t("points.second")} />
        <PointsTypography content={t("points.third")} />
      </Box>
      {userIsEnrolled ? null : (
        <Button
          disabled={buttonDisabled}
          variant="contained"
          size="large"
          sx={{ mt: 2 }}
          title={t("button.title")}
          href={paymentLink}
        >
          {t("button.title")}
        </Button>
      )}
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
  assignment: SimpleModuleData[];
  testData: SimpleModuleData[];
  assignmentTitle?: string;
};

export const getServerSideProps: GetServerSideProps<ClassDatas> = async (
  ctx
) => {
  const { locale, params, resolvedUrl } = ctx;
  const classname = urlToDatabaseFormatted(params!.name as string);

  // Ambil data program
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

  // Ambil data modul
  const moduleRes = await getModuleData(programId);

  let modules: SimpleModuleData[] = [];
  let assignment: SimpleModuleData[] = [];
  let testData: SimpleModuleData[] = [];
  let assignmentTitle: string | undefined;

  if (moduleRes) {
    const moduleData = moduleRes.message as ModuleData[];

    modules = moduleData.map((mdl) => ({
      title: mdl.title,
      href: resolvedUrl + "/learn",
    }));

    assignment = moduleData
      .filter((mdl) => mdl.additional_url)
      .map((mdl) => ({
        title: mdl.additional_url_custom_name ?? mdl.title,
        href: mdl.additional_url,
      }));

    // assignment title dari module yang memiliki additional_url
    const assignmentModule = moduleData.find((mdl) => mdl.additional_url);
    if (assignmentModule) {
      assignmentTitle = assignmentModule.additional_url_section_name;
    }

    testData = moduleData
      .filter(
        (mdl) =>
          Array.isArray(mdl.test) &&
          mdl.test.some((t) => t.test_type === "POST")
      )
      .map((mdl) => ({
        title: mdl.title,
        href: resolvedUrl + "/post-test",
      }));
  }

  return {
    props: {
      classname,
      programData,
      moduleData: modules,
      assignment,
      testData,
      assignmentTitle, //nama accordion/konten
      messages: (await import(`../../../locales/${locale}.json`)).default,
    },
  };
};
