import {
  Modal,
  Box,
  Typography,
  Button,
} from '@mui/material';

interface PostTestModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  hasAttemptedPostTest: boolean;
}

export default function PostTestModal({
  open,
  onClose,
  onConfirm,
  hasAttemptedPostTest,
}: PostTestModalProps) {
  
  // Hardcoded text for testing
  const modalTitle = hasAttemptedPostTest
    ? 'Kerjakan Ulang Post-Test'
    : 'Mulai Post-Test';

  const modalDesc = hasAttemptedPostTest
    ? 'Kamu telah mencoba sebelumnya. Ingin kerjakan ulang?'
    : 'Apakah kamu yakin ingin memulai post-test?';

  const confirmButtonText = hasAttemptedPostTest
    ? 'Kerjakan Ulang'
    : 'Kerjakan Sekarang';

  return (    
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="post-test-modal-title"
      aria-describedby="post-test-modal-description"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '100%',
          maxWidth: 500,
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          px: { xs: 2, sm: 4 },
          pt: 3,
          pb: 4,
        }}
      >
        
        <Typography
          id="post-test-modal-title"
          variant="h6"
          component="h2"
          sx={{
            textAlign: 'center',
            fontSize: { xs: '1rem', sm: '1.3rem' },
            fontWeight: 600,
            mb: 2,
          }}
        >
          {modalTitle}
        </Typography>

        <Typography
          id="post-test-modal-description"
          variant="body2"
          sx={{
            textAlign: 'center',
            color: (theme) => theme.palette.text.secondary,
            fontSize: { xs: '0.9rem', sm: '1rem' },
            mb: 3,
          }}
        >
          {modalDesc}
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="contained"
            onClick={onConfirm}
            sx={{
              minWidth: '120px',
              bgcolor: (theme) => theme.palette.primary.main,
              '&:hover': {
                bgcolor: (theme) => theme.palette.primary.dark,
              },
            }}
          >
            {confirmButtonText}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
