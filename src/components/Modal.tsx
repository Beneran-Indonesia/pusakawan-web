import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import MUIModal from '@mui/material/Modal';
import { useSpring, animated } from '@react-spring/web';
import { cloneElement, forwardRef } from 'react';

interface FadeProps {
  children: React.ReactElement;
  in?: boolean;
  onClick?: any; // eslint-disable-line
  onEnter?: (node: HTMLElement, isAppearing: boolean) => void;
  onExited?: (node: HTMLElement, isAppearing: boolean) => void;
}

const Fade = forwardRef<HTMLDivElement, FadeProps>(function Fade(props, ref) {
  const {
    children,
    in: open,
    onClick,
    onEnter,
    onExited,
    ...other
  } = props;
  const style = useSpring({
    from: { opacity: 0 },
    to: { opacity: open ? 1 : 0 },
    onStart: () => {
      if (open && onEnter) {
        onEnter(null as any, true); // eslint-disable-line
      }
    },
    onRest: () => {
      if (!open && onExited) {
        onExited(null as any, true); // eslint-disable-line
      }
    },
  });

  return (
    <animated.div ref={ref} style={style} {...other}>
      {cloneElement(children, { onClick })}
    </animated.div>
  );
});

const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 1,
  p: 2,
  borderRadius: 1
};

type ModalProps = {
  isOpen: boolean;
  toggleOpen: undefined | ((val: boolean) => void);
  children: React.ReactNode;
  boxSx?: object;  // buat style box di accordion
}

export default function Modal({ isOpen, toggleOpen, children, boxSx }: ModalProps) {
  return (
    <div>
      <MUIModal
        aria-labelledby="spring-modal-title"
        aria-describedby="spring-modal-description"
        disablePortal
        disableEnforceFocus
        disableAutoFocus
        open={isOpen}
        onClose={toggleOpen}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            TransitionComponent: Fade,
          },
        }}
      >
        <Fade in={isOpen}>
          <Box sx={{
            ...style,
            ...boxSx,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            justifyContent: "space-around",
            alignItems: "center"
          }}>
           {children}
          </Box>
        </Fade>
      </MUIModal>
    </div>
  );
}