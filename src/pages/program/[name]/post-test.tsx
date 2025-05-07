import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import CircularProgress from "@mui/material/CircularProgress";
import Head from "next/head";
import Image from "next/image";
import Container from "@mui/material/Container";
import Result from "./result";
import { useTranslations } from 'next-intl';
import { GetServerSideProps } from 'next';
import { getTestData, submitPostTestAnswers } from "@/lib/api";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { query } = context;
  const { 
    storylineId = "", 
    enrollmentId = "", 
    view = "", 
    score = "", 
    userAnswers = "", 
    moduleName = "", 
    testId = "" 
  } = query;

  return {
    props: {
      storylineId: Number(storylineId),
      enrollmentId: String(enrollmentId),
      view: String(view),
      score: score ? Number(score) : null,
      userAnswers: userAnswers ? JSON.parse(String(userAnswers)) : null,
      moduleName: String(moduleName),
      testId: String(testId),
    },
  };
};

export default function PostTest(props: {
  storylineId: number;
  enrollmentId: string;
  view: string;
  score: number | null;
  userAnswers: Record<string, string> | null;
  moduleName: string;
  testId: string;
}) {
  const {
    storylineId,
    enrollmentId: initialEnrollmentId,
    view,
    score,
    userAnswers: initialAnswers,
    moduleName: initialModuleName,
    testId: initialTestId,
  } = props;

  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [postTestData, setPostTestData] = useState<any>(null);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>(initialAnswers || {});
  const [showResults, setShowResults] = useState(view === "result");
  const [finalScore, setFinalScore] = useState(score || 0);
  const [moduleName, setModuleName] = useState(initialModuleName || "");
  const [isPassed, setIsPassed] = useState(false);
  const [enrollmentId, setEnrollmentId] = useState(initialEnrollmentId);
  const [currentTestId, setCurrentTestId] = useState(initialTestId || "");
  const [processedQuestions, setProcessedQuestions] = useState<any[]>([]);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [minCorrectAnswersNeeded, setMinCorrectAnswersNeeded] = useState(0);
  
  const t = useTranslations("postTest");

  useEffect(() => {
    if (!storylineId) return;

    const storedEnrollmentId = typeof window !== "undefined" ? localStorage.getItem("enrollmentId") : null;
    const activeEnrollmentId = enrollmentId || storedEnrollmentId || "";
    setEnrollmentId(activeEnrollmentId);

    loadTestData(Number(storylineId), initialTestId);
  }, [storylineId, initialTestId]);

  const loadTestData = async (storylineId: number, testId: string) => {
    try {
      setLoading(true);
      const response = await getTestData(String(storylineId));
  
      if (response && response.status === 200 && response.data) {
        const storylineData = response.data;
        const title = storylineData.title || "Test";
        setModuleName(title);
  
        let testData = null;
        
        if (testId) {
          testData = storylineData.test.find((t: any) => t.id.toString() === testId);
        } 
        else if (storylineData.test && storylineData.test.length > 0) {
          testData = storylineData.test[0];
        }
        
        if (!testData) {
          alert("Test tidak tersedia untuk storyline ini.");
          return;
        }
  
        if (testData.questions && testData.questions.length > 0) {
          setCurrentTestId(testData.id.toString());
          setMinCorrectAnswersNeeded(testData.min_correct_answers || Math.ceil(testData.questions.length * 0.7));
  
          const questions = testData.questions.map((q: any) => ({
            id: q.id.toString(),
            questionText: q.question,
            options: [
              { id: "a", text: q.choice_a },
              { id: "b", text: q.choice_b },
              { id: "c", text: q.choice_c },
              { id: "d", text: q.choice_d },
            ],
            correctOption: q.correct_answer
          }));
  
          const testTitle = testData.title || 
                           (testData.test_type === 'POST' ? "Post-Test" : 
                            testData.test_type === 'PRE' ? "Pre-Test" : "Test");
          
          setPostTestData({ 
            id: testData.id.toString(), 
            moduleName: title, 
            title: testTitle, 
            questions 
          });
  
          if (!showResults) {
            const initialAnswers: Record<string, string> = {};
            testData.questions.forEach((q: any) => {
              initialAnswers[q.id.toString()] = "";
            });
            setUserAnswers(initialAnswers);
          }
        }
      } else {
        alert("Gagal memuat data test. Silahkan coba lagi.");
      }
    } catch (error) {
      console.error("Error loading test data:", error);
      alert("Terjadi kesalahan saat memuat data. Silahkan coba lagi.");
    } finally {
      setLoading(false);
    }
  };  

  const handleAnswerChange = (questionId: string, value: string) => {
    setUserAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async () => {
    if (!postTestData) return;

    const allAnswered = postTestData.questions.every((q: any) => userAnswers[q.id] !== "");

    if (!allAnswered) {
      alert(t("notAllAnswered"));
      return;
    }

    setSubmitting(true);

    try {
      const formattedAnswers = Object.entries(userAnswers).map(([questionId, selectedAnswer]) => ({
        test_question: questionId,
        selected_answer: selectedAnswer,
      }));

      const response = await submitPostTestAnswers(enrollmentId, currentTestId, formattedAnswers);

      if (response && (response.status === 201 || response.status === 200)) {
        const result = response.data;
        setFinalScore(result.final_score);
        setIsPassed(result.is_passed);
        
        if (postTestData.questions) {
          const processed = postTestData.questions.map((q: any) => {
            const isCorrect = userAnswers[q.id] === q.correctOption;
            return {
              id: q.id,
              questionText: q.questionText,
              options: q.options,
              selectedOption: userAnswers[q.id],
              correctOption: q.correctOption,
              isCorrect
            };
          });
          
          setProcessedQuestions(processed);
          setCorrectAnswersCount(processed.filter((q: any) => q.isCorrect).length);
        }
        
        setShowResults(true);

        router.push({
          pathname: router.pathname,
          query: {
            ...router.query,
            view: "result",
            score: result.final_score,
            userAnswers: JSON.stringify(userAnswers),
            moduleName: moduleName,
            testId: currentTestId,
          },
        }, undefined, { shallow: true });
      } else {
        alert(t("submitError"));
      }
    } catch (error) {
      console.error("Error submitting answers:", error);
      alert(t("submitError"));
    } finally {
      setSubmitting(false);
    }
  };

  const handleNextOrRetry = () => {
    const programId = router.query.name as string;
    if (isPassed) {
      router.push(`/program/${programId}`);
    } else {
      setShowResults(false);
      router.push({
        pathname: router.pathname,
        query: {
          name: programId,
          moduleName,
          view: "test",
          storylineId,
          enrollmentId,
          testId: currentTestId,
        },
      });
    }
  };

  const handleBack = () => {
    router.push(`/program`);
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "70vh" }}>
        <CircularProgress sx={{ color: (theme) => theme.palette.primary.main }} />
      </Box>
    );
  }

  return (
    <>
      <Head>
        <title>{showResults ? t("resultTitle") : postTestData?.title || t("title")}</title>
      </Head>
      <Container maxWidth="md" sx={{ my: 5 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 3 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h2" sx={{ color: "black", fontWeight: "bold", mb: 2 }}>
              {postTestData?.title || t("title")}
            </Typography>
            <Typography variant="h5" sx={{ color: "black", fontWeight: "medium" }}>
              {moduleName}
            </Typography>
          </Box>
          <Box sx={{ width: 200, height: 85, position: "relative" }}>
            <Image src="/pusakawan.svg" alt="Pusakawan Logo" layout="fill" objectFit="contain" />
          </Box>
        </Box>

        <Box sx={{ width: "100%", mx: "auto", borderBottom: "2px solid #ddd", mb: 3 }} />

        {showResults ? (
          <Result
            score={Number(finalScore)}
            isPassed={isPassed}
            handleNextOrRetry={handleNextOrRetry}
            handleBack={handleBack}
            processedQuestions={processedQuestions}
            correctAnswersCount={correctAnswersCount}
            minCorrectAnswersNeeded={minCorrectAnswersNeeded}
            programId={router.query.name as string}
          />
        ) : (
          <>
            <Box sx={{ py: 3 }}>
              {postTestData?.questions?.map((question: any, index: number) => (
                <Box key={question.id} sx={{ mb: 4 }}>
                  <Typography variant="body1" sx={{ fontWeight: "bold", mb: 2 }}>
                    {index + 1}. {question.questionText}
                  </Typography>
                  <FormControl component="fieldset">
                    <RadioGroup
                      name={`question-${question.id}`}
                      value={userAnswers[question.id] || ""}
                      onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                    >
                      {question.options.map((option: any) => (
                        <FormControlLabel key={option.id} value={option.id} control={<Radio />} label={option.text} />
                      ))}
                    </RadioGroup>
                  </FormControl>
                </Box>
              ))}
            </Box>

            <Button
              variant="contained"
              sx={{ width: "100%", mb: 3 }}
              onClick={handleSubmit}
              disabled={submitting || !postTestData?.questions || postTestData.questions.length === 0}
            >
              {submitting ? t("submitting") : t("submit")}
            </Button>
          </>
        )}
      </Container>
    </>
  );
}