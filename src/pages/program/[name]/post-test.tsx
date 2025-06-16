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
import { getSession } from "next-auth/react";
import ImageWrapper from "@/components/ImageWrapper";
import { getModuleData, getProgramData, SubmitTest } from "@/lib/api";
import { TestItem, ProgramData, ModuleData, TestAnswer, SubmitTestResponse } from "@/types/components";
import { urlToDatabaseFormatted } from "@/lib/utils";
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import Modal from "@/components/Modal";

interface Props {
  programId: string;
  programTitle: string;
  postTest: TestItem;
  enrollmentId: number;
}

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  const { name } = context.params as { name: string };

  // 1. session/login user
  const session = await getSession(context);
  if (!session) {
    return { notFound: true };
  }

  // 2. ambil data program (sama kayak di learn.tsx)
  const classname = urlToDatabaseFormatted(name);
  const programDataReq = await getProgramData(classname);

  if (!programDataReq || !programDataReq.message || programDataReq.message.length === 0) {
    console.log("Program tidak ditemukan");
    return { notFound: true };
  }

  const programData = programDataReq.message[0] as ProgramData;

  // 3. ngecek user enrolled di program ini?
  const { enrolledPrograms } = session.user;
  const userEnrollment = enrolledPrograms.find((program) => program.title === classname);
  console.log('userEnrollment', userEnrollment)

  if (!userEnrollment) {
    console.log("User tidak enrolled di program ini");
    return { notFound: true };
  }

  const enrollmentId = userEnrollment.enrollment_id;
  if (!enrollmentId) {
    console.log("Enrollment ID tidak valid:", userEnrollment);
    return { notFound: true };
  }

  // ambil data module by program.id
  const moduleDataReq = await getModuleData(programData.id.toString());

  if (!moduleDataReq || !moduleDataReq.message || !Array.isArray(moduleDataReq.message)) {
    console.log("Data module tidak valid");
    return { notFound: true };
  }

  const modules = moduleDataReq.message as ModuleData[];

  // cari module yang punya POST test
  const moduleWithPostTest = modules.find(
    (mod) => mod.test?.some((t) => t.test_type === "POST")
  );

  if (!moduleWithPostTest) {
    console.log("Tidak ada module dengan POST test");
    return { notFound: true };
  }

  const postTest = moduleWithPostTest.test!.find((t) => t.test_type === "POST");

  if (!postTest) {
    console.log("POST test tidak ditemukan");
    return { notFound: true };
  }

  return {
    props: {
      programId: programData.id.toString(),
      programTitle: programData.title,
      postTest,
      enrollmentId: enrollmentId,
    },
  };
};

export default function PostTest({ programId, programTitle, postTest, enrollmentId }: Props) {
  const router = useRouter();
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>(() => {
    const initialAnswers: Record<number, string> = {};
    postTest.questions.forEach((q) => {
      initialAnswers[q.id] = "";
    });
    return initialAnswers;
  });
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<SubmitTestResponse | null>(null);  // menyimpan hasil post-test
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [modalOpen, setModalOpen] = useState(false); // untuk modal kerjakan ulang

  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => setModalOpen(false);

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
    setModalOpen(false);
  };

  // submit jawaban
  const handleSubmit = async () => {
    const allAnswered = postTest.questions.every(
      (q) => userAnswers[q.id] !== ""
    );
    if (!allAnswered) {
      alert("Harap jawab semua pertanyaan.");
      return;
    }


    // POST jawaban pake session/token
    const session = await getSession();
    if (!session?.user?.accessToken) {
      console.log("Session expired. Please login again.");
      return;
    }

    setSubmitting(true);

    try {
      const answers: TestAnswer[] = postTest.questions.map((q): TestAnswer => ({
        test_question: q.id,
        selected_answer: userAnswers[q.id],
      }));

      // kirim ke backend
      const response = await SubmitTest(enrollmentId, postTest.id, answers, session.user.accessToken);
      

      if (response.status === 200 || response.status === 201) {
        setResult(response.data);  //menampilkan result
        setIsSubmitted(true);
      }

    } catch (error: any) {
      console.error("Error submit:", error);
      
      let alertMessage = "Terjadi kesalahan saat mengirim jawaban.";
      
      if (error?.response?.data?.message) {
        // message dari API
        alertMessage = error.response.data.message;
      } else if (error?.message) {
        alertMessage = error.message;
      }
      alert(alertMessage);
      
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
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            mb: 1
          }}
        >
          {/* Bagian kiri header */}
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h3" sx={{ color: 'black', fontWeight: '700', mb: 2 }}>
              Post-Test
            </Typography>
            <Typography variant="h4" sx={{ color: 'black', fontWeight: '500' }}>
              {programTitle}
            </Typography>
          </Box>

          {/* Logo Pusakawan */}
          <Box sx={{ position: 'relative' }}>
            <ImageWrapper
              src="/pusakawan.svg"
              width={150}
              height={85}
              alt="pusakawan logo"
            />
          </Box>
        </Box>

        {/* Garis horizontal */}
        <Box sx={{ width: '100%', mx: 'auto', borderBottom: '2px solid #ddd', mb: 3, mt: 0.5 }} />

        {isSubmitted && result && (
          <Box
            sx={{
              mb: 4,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              flexWrap: 'wrap'
            }}
          >
            {/* Status lulus/tidak */}
            <Box sx={{ maxWidth: '600px' }}>
              <Typography
                variant="h4"
                sx={{ fontWeight: 700, mb: 1 }}
              >
                {result.is_passed ? 'Selamat, Kamu Lulus!' : 'Kamu Belum Lulus'}
              </Typography>

              {!result.is_passed && (
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: 'monochrome.five',
                    lineHeight: 1.6,
                  }}
                >
                  Kamu berhasil mengerjakan soal dengan {result.total_correct} jawaban benar dari {result.total_questions} total soal. Untuk lulus minimal skor {result.passing_score}/100.
                </Typography>
              )}
            </Box>

            {/* Kanan: Skor */}
            <Box
              sx={{
                backgroundColor: 'primary.main',
                color: 'white',
                px: 2,
                py: 1.5,
                borderRadius: '0.5rem',
                minWidth: '100px',
                textAlign: 'center',
                fontSize: '1rem',
                fontWeight: 700,
                boxShadow: 1,
                // mt: { xs: 2, sm: 0 }
              }}
            >
              Skor {result.final_score}/100
            </Box>
          </Box>
        )}

        {/* Question */}
        <Box sx={{ py: 3 }}>
          {postTest.questions.map((question, idx) => {
            const selectedAnswer = userAnswers[question.id];
            const graded = result?.graded_answers.find(g => g.question_id === question.id);
            const isCorrect = graded?.is_correct;

            return (
              <Box key={question.id} sx={{ mb: 4 }}>
                <Typography variant="h5" sx={{ fontWeight: '700', mb: 2 }}>
                  {idx + 1}. {question.question}
                </Typography>

                <Box sx={{ ml: { xs: 1, sm: 4 } }}>
                  <FormControl sx={{ mt: 1, width: '100%' }}>
                    <RadioGroup
                      value={selectedAnswer}
                      onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                    >
                      {(['A', 'B', 'C', 'D'] as const).map((opt) => {
                        const label = question[`choice_${opt.toLowerCase()}` as keyof typeof question];
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
                        display: 'flex',
                        alignItems: 'center',
                        color: isCorrect ? 'green' : 'primary.main',
                      }}
                    >
                      {isCorrect ? (
                        <>
                          <CheckIcon sx={{ mr: 1 }} />
                          <Typography sx={{ fontWeight: '500' }}>Jawaban ini benar</Typography>
                        </>
                      ) : (
                        <>
                          <CloseIcon sx={{ mr: 1 }} />
                          <Typography sx={{ fontWeight: '500' }}>Jawaban ini kurang tepat</Typography>
                        </>
                      )}
                    </Box>
                  )}
                </Box>
              </Box>
            );
          })}

          {/* Tombol submit*/}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 6 }}>
            {!isSubmitted && (
              <>
                <Button
                  variant="outlined"
                  onClick={handleBack}
                  disabled={submitting}
                >
                  Kembali
                </Button>
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={submitting}
                  sx={{ px: 4 }}
                >
                  {submitting ? (
                    <>
                      <CircularProgress size={20} sx={{ mr: 1 }} />
                      Mengirim...
                    </>
                  ) : (
                    "Kirim Jawaban"
                  )}
                </Button>
              </>
            )}

            {isSubmitted && result?.is_passed && (
              <Button
                variant="contained"
                onClick={() => router.push(`/program/${router.query.name}`)}
              >
                Selanjutnya
              </Button>
            )}

            {isSubmitted && !result?.is_passed && (
              <>
                <Box display="flex" gap={2} mt={2}>
                  <Button variant="outlined" onClick={handleBack}>
                    Kembali
                  </Button>
                  <Button variant="contained" onClick={handleModalOpen}>
                    Kerjakan Ulang
                  </Button>
                </Box>

                {/* Modal Konfirmasi */}
                <Modal
                  isOpen={modalOpen}
                  toggleOpen={handleModalClose}
                  boxSx={{ width: 600, p: 4, borderRadius: 2 }}
                >
                  <Typography variant="h5" fontWeight={600} mb={2}>
                    Ulangi Post-Test?
                  </Typography>

                  <Typography mb={4} align="center" color="monochrome.four">
                    Apakah kamu yakin ingin mengulang post-test ini?
                    <br />
                    {result?.attempt_info ? (
                      <>
                        Kamu masih punya{' '}
                        <Box component="span" sx={{ color: 'primary.main', fontWeight: 600 }}>
                          {result.attempt_info.max_attempt - result.attempt_info.attempts_used}
                        </Box>{' '}
                        dari {result.attempt_info.max_attempt} kesempatan dalam 24 jam
                      </>
                    ) : (
                      'Memuat data percobaan...'
                    )}
                  </Typography>

                  <Box display="flex" gap={2} justifyContent="flex-end">
                    <Button
                      variant="outlined"
                      size="large"
                      onClick={handleModalClose}
                    >
                      Batal
                    </Button>
                    <Button
                      variant="contained"
                      size="large"
                      onClick={handleConfirmPostTest}
                    >
                      Kerjakan Ulang
                    </Button>
                  </Box>
                </Modal>
              </>
            )}
          </Box>
        </Box>
      </Container>
    </>
  );
}