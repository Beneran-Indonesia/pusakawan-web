import { useDesktopRatio } from "@/lib/hooks";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";

/**
 * @typedef {Object} AgreementModalProps AgreementModalProps
 * @property {boolean} open open modal
 * @property {"T&C" | "PP"} type type of agreement. Terms and Conditions or Privacy Policy
 * @property {() => void} handleClose close modal
 */
type AgreementModalProps = {
  type: "T&C" | "PP";
  open: boolean;
  handleClose: () => void;
};

// Modal to show the T&C
export default function AgreementModal({
  type,
  open,
  handleClose,
}: AgreementModalProps) {
  const isDesktopRation = useDesktopRatio();
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="agreements modal"
      aria-describedby="read our agreements"
    >
      <Box>
        <iframe
          src={
            "/assets/" +
            (type === "T&C"
              ? "terms-and-condition.html"
              : "privacy-policy.html")
          }
          style={{
            width: isDesktopRation ? "50%" : "85%",
            height: "80vh",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            borderRadius: 14,
          }}
        />
      </Box>
    </Modal>
  );
}
