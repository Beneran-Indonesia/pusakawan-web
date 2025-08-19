import { GetServerSideProps } from "next";
import { useState } from "react";
import { useRouter } from "next/router";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import Head from "next/head";
import { useSession, getSession } from "next-auth/react";
import { getModuleData, getProgramData, submitTest } from "@/lib/api";
import {
  TestItem,
  ProgramData,
  ModuleData,
  TestAnswer,
  SubmitTestResponse,
} from "@/types/components";
import { urlToDatabaseFormatted } from "@/lib/utils";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import Modal from "@/components/Modal";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useTranslations } from "next-intl";
import PusakawanLogo from "@/components/PusakawanLogo";

export default function PostTest({
  programTitle,
  postTest,
  enrollmentId,
}: PostTestProps) {
  const { data: session, update } = useSession();

  const t = useTranslations("post_test");
  const router = useRouter();
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>(() => {
    const initialAnswers: Record<number, string> = {};
    postTest.questions.forEach((q) => {
      initialAnswers[q.id] = "";
    });
    return initialAnswers;
  });
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<SubmitTestResponse | null>(null); // menyimpan hasil post-test
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [reattemptModalOpen, setReattemptModalOpen] = useState(false); // untuk modal kerjakan ulang
  const [submitModalOpen, setSubmitModalOpen] = useState(false); // for submit answers modal

  const handleSubmitModalOpen = () => setSubmitModalOpen(true);
  const handleSubmitModalClose = () => setSubmitModalOpen(false);

  const handleReattemptModalOpen = () => setReattemptModalOpen(true);
  const handleReattemptModalClose = () => setReattemptModalOpen(false);

  // snackbar
  const [snackbarOpen, setSnackbarOpen] = useState({
    open: false,
    success: false,
    message: "",
  });

  const handleSnackbarOpen = (
    open: boolean,
    success: boolean,
    message: string
  ) => setSnackbarOpen({ open, success, message });
  const handleSnackbarClose = () =>
    setSnackbarOpen({ ...snackbarOpen, open: false });

  const handleAnswerChange = (questionId: number, value: string) => {
    setUserAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  // untuk modal
  const handleConfirmPostTest = () => {
    setIsSubmitted(false);
    setResult(null);
    setUserAnswers(() => {
      const resetAnswers: Record<number, string> = {};
      postTest.questions.forEach((q) => {
        resetAnswers[q.id] = "";
      });
      return resetAnswers;
    });
    setReattemptModalOpen(false);
  };

  // submit jawaban
  const handleSubmit = async () => {
    const allAnswered = postTest.questions.every(
      (q) => userAnswers[q.id] !== ""
    );
    if (!allAnswered) {
      handleSnackbarOpen(true, false, t("error.not_all_answered"));
      console.error("ERROR handleSubmit: ALL QUESTIONS ARE NOT ANSWERED");
      handleSubmitModalClose();
      return;
    }

    // POST jawaban pake session/token

    if (!session?.user?.accessToken) {
      handleSnackbarOpen(true, false, t("error.session_expired"));
      router.push("/signin");
      console.error("ERROR handleSubmit: SESSION EXPIRED");
      return;
    }

    setSubmitting(true);

    try {
      const answers: TestAnswer[] = postTest.questions.map(
        (q): TestAnswer => ({
          test_question: q.id,
          selected_answer: userAnswers[q.id],
        })
      );

      // kirim ke backend
      const response = await submitTest(
        enrollmentId,
        postTest.id,
        answers,
        session.user.accessToken
      );

      if (response.status === 200 || response.status === 201) {
        const submissionData: SubmitTestResponse = response.data;
        handleSubmitModalClose();
        setResult(submissionData); // menampilkan result
        setIsSubmitted(true);
        await update({
          ...session,
          user: {
            ...session.user,
            enrolledPrograms: session.user.enrolledPrograms.map(program => 
              program.enrollment_id === enrollmentId 
                ? {
                    ...program,
                    test_submissions: {
                      is_passed: submissionData.is_passed,
                    }
                  }
                : program
            )
          }
        });
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error submit:", error);

      let alertMessage = t("error.submit");

      if (!error) return;

      if (error?.response?.data?.message) {
        // message dari API
        alertMessage = error.response.data.message;
      } else if (error?.message) {
        alertMessage = error.message;
      }
      console.error("handleSubmit ERROR MESSAGE: ", alertMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    router.push(`/program/${router.query.name}`);
  };

  return (
    <>
      <Head>
        <title>Post-Test - {programTitle}</title>
      </Head>

      <Container maxWidth="md" sx={{ my: 5 }}>
        {/* Header dengan logo */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 1,
          }}
        >
          {/* Bagian kiri header */}
          <Box sx={{ flexGrow: 1 }}>
            <Typography
              variant="h3"
              sx={{ color: "black", fontWeight: "700", mb: 2 }}
            >
              {t("title")}
            </Typography>
            <Typography variant="h4" sx={{ color: "black", fontWeight: "500" }}>
              {programTitle}
            </Typography>
          </Box>

          {/* Logo Pusakawan */}
          <PusakawanLogo white={false} height={85} width={150} />
        </Box>

        {/* Garis horizontal */}
        <Box
          sx={{
            width: "100%",
            mx: "auto",
            borderBottom: "2px solid #ddd",
            mb: 3,
            mt: 0.5,
          }}
        />

        {isSubmitted && result && (
          <Box
            sx={{
              mb: 4,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              flexWrap: "wrap",
            }}
          >
            {/* Status lulus/tidak */}
            <Box sx={{ maxWidth: "600px" }}>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                {result.is_passed ? t("result.passed") : t("result.failed")}
              </Typography>

              <Typography
                variant="subtitle1"
                sx={{
                  color: "monochrome.five",
                  lineHeight: 1.6,
                }}
              >
                {t("result.score_message", {
                  total_correct: result.total_correct,
                  total_questions: result.total_questions,
                  passing_score: result.passing_score,
                })}
              </Typography>
            </Box>

            {/* Kanan: Skor */}
            <Box
              sx={{
                backgroundColor: "primary.main",
                color: "white",
                px: 2,
                py: 1.5,
                borderRadius: "0.5rem",
                minWidth: "100px",
                textAlign: "center",
                fontSize: "1rem",
                fontWeight: 700,
                boxShadow: 1,
                mt: { xs: 2, sm: 0 },
              }}
            >
              {t("result.score_amount", { final_score: result.final_score })}
            </Box>
          </Box>
        )}

        {/* Question */}
        <Box sx={{ py: 3 }}>
          {postTest.questions.map((question, idx) => {
            const selectedAnswer = userAnswers[question.id];
            const graded = result?.graded_answers.find(
              (g) => g.question_id === question.id
            );
            const isCorrect = graded?.is_correct;

            return (
              <Box key={question.id} sx={{ mb: 4 }}>
                <Typography variant="h5" sx={{ fontWeight: "700", mb: 2 }}>
                  {idx + 1}. {question.question}
                </Typography>

                <Box sx={{ ml: { xs: 1, sm: 4 }, width: "fit-content" }}>
                  <FormControl sx={{ mt: 1, width: "100%" }}>
                    <RadioGroup
                      value={selectedAnswer}
                      onChange={(e) =>
                        handleAnswerChange(question.id, e.target.value)
                      }
                    >
                      {(["A", "B", "C", "D"] as const).map((opt) => {
                        const label =
                          question[
                            `choice_${opt.toLowerCase()}` as keyof typeof question
                          ];
                        return (
                          <FormControlLabel
                            key={opt}
                            value={opt}
                            control={<Radio disabled={isSubmitted} />}
                            label={`${opt}. ${label}`}
                            sx={{ mb: 1 }}
                          />
                        );
                      })}
                    </RadioGroup>
                  </FormControl>

                  {isSubmitted && graded && (
                    <Box
                      sx={{
                        mt: 1,
                        display: "flex",
                        alignItems: "center",
                        color: isCorrect ? "green" : "primary.main",
                      }}
                    >
                      {isCorrect ? (
                        <>
                          <CheckIcon sx={{ mr: 1 }} />
                          <Typography sx={{ fontWeight: "500" }}>
                            {t("result.question_correct")}
                          </Typography>
                        </>
                      ) : (
                        <>
                          <CloseIcon sx={{ mr: 1 }} />
                          <Typography sx={{ fontWeight: "500" }}>
                            {t("result.question_incorrect")}
                          </Typography>
                        </>
                      )}
                    </Box>
                  )}
                </Box>
              </Box>
            );
          })}

          {/* Tombol submit*/}
          <Box
            sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 6 }}
          >
            {!isSubmitted && (
              <>
                <Button
                  variant="outlined"
                  onClick={handleBack}
                  disabled={submitting}
                >
                  {t("button.return")}
                </Button>
                <Button
                  variant="contained"
                  onClick={handleSubmitModalOpen}
                  disabled={submitting}
                  sx={{ px: 4 }}
                >
                  {submitting ? (
                    <>
                      <CircularProgress size={20} sx={{ mr: 1 }} />
                      {t("submitting")}
                    </>
                  ) : (
                    t("button.submit")
                  )}
                </Button>
              </>
            )}

            {isSubmitted && result?.is_passed && (
              <Button
                variant="contained"
                onClick={() => router.push(`/program/${router.query.name}`)}
              >
                {t("button.next")}
              </Button>
            )}

            {isSubmitted && !result?.is_passed && (
              <>
                <Box display="flex" gap={2} mt={2}>
                  <Button variant="outlined" onClick={handleBack}>
                    {t("button.return")}
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleReattemptModalOpen}
                  >
                    {t("button.redo")}
                  </Button>
                </Box>

                {/* confirm modal for re-attempt */}
                <Modal
                  isOpen={reattemptModalOpen}
                  toggleOpen={handleReattemptModalClose}
                  boxSx={{ width: 600, p: 4, borderRadius: 2 }}
                >
                  <Typography variant="h5" fontWeight={600} mb={2}>
                    {t("modal.redo")}
                  </Typography>

                  <Typography mb={4} align="center" color="monochrome.four">
                    {t("modal.confirmation")}
                    <br />
                    {result?.attempt_info ? (
                      <>
                        {t("modal.redo.attempt_message_one")}{" "}
                        <Box
                          component="span"
                          sx={{ color: "primary.main", fontWeight: 600 }}
                        >
                          {result.attempt_info.max_attempt -
                            result.attempt_info.attempts_used}
                        </Box>{" "}
                        {t("modal.redo.attempt_message_two", {
                          max_attempt: result.attempt_info.max_attempt,
                        })}
                      </>
                    ) : (
                      t("modal.redo.loading")
                    )}
                  </Typography>

                  <Box display="flex" gap={2} justifyContent="flex-end">
                    <Button
                      variant="outlined"
                      size="large"
                      onClick={handleReattemptModalClose}
                    >
                      {t("button.cancel")}
                    </Button>
                    <Button
                      variant="contained"
                      size="large"
                      onClick={handleConfirmPostTest}
                    >
                      {t("button.redo")}
                    </Button>
                  </Box>
                </Modal>
              </>
            )}
            {/* confirm modal for submitting */}
            <Modal
              isOpen={submitModalOpen}
              toggleOpen={handleSubmitModalClose}
              boxSx={{ width: { md: 600, sm: 400 }, p: 4, borderRadius: 2 }}
            >
              <Typography
                mb={2}
                fontWeight={500}
                align="center"
                color="monochrome.four"
              >
                {t("modal.confirmation.title")}
              </Typography>
              <Box
                display="flex"
                flex="column"
                gap={3}
                sx={{ "& button": { textTransform: "none" } }}
              >
                <Button variant="contained" size="large" onClick={handleSubmit}>
                  {t("modal.confirmation.confirm_button")}
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={handleSubmitModalClose}
                >
                  {t("modal.confirmation.cancel_button")}
                </Button>
              </Box>
            </Modal>
          </Box>
        </Box>

        {/* snackbar on bottom left */}
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
      </Container>
    </>
  );
}

interface PostTestProps {
  programTitle: string;
  enrollmentId: number;
  postTest: TestItem;
}

export const getServerSideProps: GetServerSideProps<PostTestProps> = async (
  context
) => {
  const { locale, params } = context;
  const urlClassName = params!.name as string;

  // 1. session/login user
  const session = await getSession(context);
  if (!session) {
    return { notFound: true };
  }

  // 2. ambil data program (sama kayak di learn.tsx)
  const classname = urlToDatabaseFormatted(urlClassName);
  const programDataReq = await getProgramData(classname);

  if (
    !programDataReq ||
    !programDataReq.message ||
    programDataReq.message.length === 0
  ) {
    console.error("POST TEST GETSERVERSIDE ERROR: Program not found");
    return { notFound: true };
  }

  const programData: ProgramData = programDataReq.message[0];

  // 3. ngecek user enrolled di program ini?
  const { enrolledPrograms } = session.user;
  const userEnrolled = enrolledPrograms.find(
    (program) => program.id === programData.id
  );

  if (!userEnrolled) {
    console.error(
      "POST TEST GETSERVERSIDE ERROR: User is not enrolled in class"
    );
    return { notFound: true };
  }

  const enrollmentId = userEnrolled.enrollment_id;
  if (!enrollmentId) {
    console.error(
      "POST TEST GETSERVERSIDE ERROR: Enrollment ID not valid:",
      userEnrolled
    );
    return { notFound: true };
  }

  const hasPassed = !!userEnrolled.test_submissions?.is_passed;
  // Prevent access if user has already passed the post-test
  if (hasPassed) {
    return { notFound: true };
  }

  // ambil data module by program.id
  const moduleDataReq = await getModuleData(programData.id);

  if (!moduleDataReq || !moduleDataReq.message) {
    console.error("POST TEST GETSERVERSIDE ERROR: Module data is not valid");
    return { notFound: true };
  }

  const modules: ModuleData[] = moduleDataReq.message;

  // cari module yang punya POST test
  const moduleWithPostTest = modules.find((mod) =>
    mod.test?.some((t) => t.test_type === "POST")
  );

  if (!moduleWithPostTest) {
    console.error("POST TEST GETSERVERSIDE ERROR: no module with POST test");
    return { notFound: true };
  }

  const postTest = moduleWithPostTest.test!.find((t) => t.test_type === "POST");

  if (!postTest) {
    console.error("POST TEST GETSERVERSIDE ERROR: POST test not found");
    return { notFound: true };
  }

  return {
    props: {
      programTitle: programData.title,
      postTest,
      enrollmentId: enrollmentId,
      messages: (await import(`../../../locales/${locale}.json`)).default,
    },
  };
};
