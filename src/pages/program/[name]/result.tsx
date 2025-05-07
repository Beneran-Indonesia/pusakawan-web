import { useRouter } from "next/router";
import { useState } from 'react';
import { Box, Typography, Button, Radio } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import PostTestModal from '@/components/PostTest/PostTestModal';

interface ResultProps {
  processedQuestions: {
    id: string;
    question: string;
    options: { id: string; text: string }[];
    selectedOption: string;
    correctOption: string;
    isCorrect: boolean;
  }[];
  score: number;
  isPassed: boolean;
  correctAnswersCount: number;
  minCorrectAnswersNeeded: number;
  handleBack: () => void;
  handleNextOrRetry: () => void;
  programId: string;
}

export default function Result({
  processedQuestions,
  score,
  isPassed,
  correctAnswersCount,
  minCorrectAnswersNeeded,
  handleBack,
  handleNextOrRetry,
  programId
}: ResultProps) {
  const router = useRouter();
  const [showRetryModal, setShowRetryModal] = useState(false);

  const handleButtonClick = () => {
    if (isPassed) {
      router.push(`/program/${programId}`);
    } else {
      setShowRetryModal(true); 
    }
  };

  const renderOptions = (question: ResultProps['processedQuestions'][number]) => {
    return (
      <Box>
        {question.options.map((option: any) => {
          const isSelected = question.selectedOption === option.id;
          const isCorrect = question.correctOption === option.id;
          
          return (
            <Box 
              key={option.id} 
              sx={{ 
                mb: 1,
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <Radio 
                checked={isSelected}
                disabled
                sx={{
                  '&.Mui-checked': {
                    color: theme => isCorrect ? 'green' : theme.palette.primary.main,
                  },
                  '&.Mui-disabled': {
                    color: theme => theme.palette.monochrome.four
                  }
                }}
              />
              <Typography 
                variant="body1"
                sx={{ 
                  ml: 1,
                  color: theme => theme.palette.monochrome.five,
                  fontSize: { xs: '0.9rem', sm: '1rem' }
                }}
              >
                {option.text}
              </Typography>
            </Box>
          );
        })}

        <Box 
          sx={{ 
            ml: { xs: 2, sm: 6 }, 
            mt: 1,
            display: 'flex',
            alignItems: 'center',
            bgcolor: question.isCorrect ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)',
            px: 1,
            py: 0.5,
            borderRadius: 1,
            width: 'fit-content'
          }}
        >
          <Box
            sx={(theme) => ({
              border: `2px solid ${question.isCorrect ? 'green' : theme.palette.primary.main}`,
              borderRadius: '50%',
              width: '30px',
              height: '30px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              mr: 1
            })}
          >
            {question.isCorrect 
              ? <CheckIcon sx={{ color: 'green', fontSize: '20px' }} /> 
              : <CloseIcon sx={{ color: theme => theme.palette.primary.main, fontSize: '20px' }} />
            }
          </Box>
          <Typography 
            variant="body2"
            sx={{ 
              color: question.isCorrect ? 'green' : theme => theme.palette.primary.main,
              fontSize: { xs: '0.8rem', sm: '0.875rem' }
            }}
          >
            {question.isCorrect ? 'Jawaban ini benar' : 'Jawaban ini kurang tepat'}
          </Typography>
        </Box>
      </Box>
    );
  };

  return (
    <>
      <Box sx={{ position: 'relative', mb: 4 }}>
        <Box sx={{ pr: { xs: 8, sm: 16 } }}>
          <Typography 
            variant="h6" 
            sx={{ 
              color: theme => theme.palette.monochrome.five, 
              fontWeight: 600,
              mb: 2,
              fontSize: { xs: '1.0rem', sm: '1.5rem' }
            }}
          >
            {isPassed ? 'Selamat kamu Lulus' : 'Kamu Belum Lulus'}
          </Typography>
          
          <Typography 
            variant="body1" 
            sx={{ 
              color: theme => theme.palette.monochrome.five,
              fontSize: { xs: '0.75rem', sm: '1rem' },
            }}
          >
            Kamu berhasil mengerjakan soal dengan {correctAnswersCount} jawaban benar dari total {processedQuestions.length} soal.
            {!isPassed && ` Untuk lulus minimal ${minCorrectAnswersNeeded} jawaban benar dari soal.`}
          </Typography>
        </Box>

        <Box 
          sx={{ 
            position: 'absolute',
            top: 0,
            right: 0,
            bgcolor: theme => theme.palette.primary.main, 
            color: theme => theme.palette.monochrome.main, 
            px: 2, 
            py: 1, 
            borderRadius: 1,
            zIndex: 2,
            display: 'block'
          }}
        >
          <Typography 
            variant="h6"
            sx={{
              fontSize: { xs: '1rem', sm: '1rem' }
            }}
          >
            Skor {score}/100
          </Typography>
        </Box>
      </Box>

      {processedQuestions.map((question, index) => (
        <Box key={question.id} sx={{ mt: 4 }}>
          <Typography 
            variant="body1" 
            sx={{ 
              fontWeight: 600, 
              mb: 2,
              fontSize: { xs: '0.95rem', sm: '1rem' }
            }}
          >
            {index + 1}. {question.question}
          </Typography>
          <Box sx={{ ml: { xs: 1, sm: 2 } }}>
            {renderOptions(question)}
          </Box>
        </Box>
      ))}

      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'flex-end', 
          mt: 4,
          gap: 2
        }}
      >
        <Button
          variant="outlined"
          onClick={handleBack}
          sx={{ 
            borderColor: theme => theme.palette.primary.main, 
            color: theme => theme.palette.primary.main,
            '&:hover': { 
              bgcolor: 'rgba(174, 22, 34, 0.04)' 
            }
          }}
        >
          Kembali
        </Button>
        <Button
          variant="contained"
          sx={{ 
            bgcolor: theme => theme.palette.primary.main, 
            '&:hover': { 
              bgcolor: theme => theme.palette.primary.dark
            }
          }}
          onClick={handleButtonClick}
        >
          {isPassed ? 'Selanjutnya' : 'Kerjakan Ulang'}
        </Button>

        <PostTestModal
          open={showRetryModal}
          onClose={() => setShowRetryModal(false)}
          onConfirm={() => {
            setShowRetryModal(false);
            handleNextOrRetry(); 
          }}
          hasAttemptedPostTest={true}
        />
      </Box>
    </>
  );
}