import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import LogoWrapper from "@/components/ImageWrapper";
import GoogleSVG from "@tplogos/google.svg";
import UnsplashLogin from "@images/unsplash_login.png";
import Waves from "@svgs/waves.svg";
import Head from "next/head";
import { useRouter } from "next/router";
import LoadingButton from "@mui/lab/LoadingButton";
import { signUpWithGoogle } from "@/lib/firebase";
import HomeButton from "@/components/HomeButton";
import { useDesktopRatio } from "@/lib/hooks";
import Modal from "@mui/material/Modal";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { LoginUserProps } from "@/types/auth";
import { SubmitHandler, useForm } from "react-hook-form";
import Link from "next/link";
import PasswordInput from "@/components/Form/PasswordInput";
import { Input } from "@/components/Form/Input";
import UnderlinedLink from "@/components/UnderlinedLink";

const LoginContainer = ({ children }: { children: React.ReactNode }) => {
  const isDesktopRatio = useDesktopRatio();
  return (
    <Container
      sx={{
        display: "flex",
        justifyContent: "space-evenly",
        gap: 7.5,
        padding: isDesktopRatio ? "2rem" : "1.5rem 0.75rem",
        alignItems: "center",
        width: isDesktopRatio ? "100%" : "fit-content",
        height: isDesktopRatio ? "730px" : "100%",
        background:
          "linear-gradient(284deg, #EFD0D3 2.42%, rgba(239, 208, 211, 0.29) 98.68%)",
        backdropFilter: "blur(8px)",
        margin: isDesktopRatio ? "auto" : "1rem",
        borderRadius: "0.5rem",
      }}
    >
      {children}
    </Container>
  );
};

export default function SignIn() {
  const isDesktopRatio = useDesktopRatio();
  return (
    <>
      <Head>
        <title>Sign in to Pusakawan</title>
      </Head>
      {/* Background div with waves and such */}
      <Grid
        container
        component="main"
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
        sx={{
          minHeight: "100vh",
          backgroundImage: `url(${Waves.src})`,
          backgroundRepeat: "repeat-x",
          backgroundPosition: "bottom",
        }}
      >
        <HomeButton
          sx={{ position: "absolute", left: "15%", top: "8%", zIndex: 1 }}
        />
        {/* Flex: Unsplash image & LoginForm */}
        {isDesktopRatio ? null : (
          <LogoWrapper
            alt="circle logo"
            src="/circle_logo.svg"
            width={52}
            height={52}
          />
        )}

        <LoginContainer>
          <LogoWrapper
            alt="Unsplash image"
            src={UnsplashLogin}
            style={{
              borderRadius: "1rem",
              display: isDesktopRatio ? "block" : "none",
            }}
            priority={true}
          />
          <LoginBox />
        </LoginContainer>
      </Grid>
    </>
  );
}

type APIErrorMessageTypes = {
  error: boolean;
  type: string;
  message: string;
};

const errorMessageInit = () => ({
  error: false,
  type: "",
  message: "",
});

function LoginBox() {
  // States
  const [loginPage, setLoginPage] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] =
    useState<APIErrorMessageTypes>(errorMessageInit);
  const [showPassword, setShowPassword] = useState(false);

  // Others
  const t = useTranslations("signin");
  const router = useRouter();
  const { control, handleSubmit, setError } = useForm<LoginUserProps>({
    defaultValues: { email: "", password: "" },
  });
  // Submit
  const onSubmit: SubmitHandler<LoginUserProps> = async (data) => {
    setLoading(true);
    const { email, password, remember } = data;
    signIn("email", {
      redirect: false,
      email,
      password,
      remember,
    })
      .then((dt) => {
        setLoading(false);
        // If for some reason it fails send server error (or when error apepars but no error data)
        if (dt === undefined || (!dt.ok && !dt.error)) {
          setError("email", { type: "custom", message: "" });
          setError("password", { type: "custom", message: "" });
          setErrorMessage({
            error: true,
            type: "server",
            message: t("error.server"),
          });
          return;
        }
        if (dt.error) {
          setError("email", { type: "custom", message: "" });
          setError("password", { type: "custom", message: "" });
          // Create custom messages according to return error message
          const error = dt.error;
          if (error.charAt(0) === "I") {
            setErrorMessage({
              error: true,
              type: "invalid_credentials",
              message: t("error.invalid_credentials"),
            });
            return;
          } else if (error.charAt(0) === "A") {
            setErrorMessage({
              error: true,
              type: "account_disabled",
              message: t("error.account_disabled"),
            });
            return;
          } else if (error.charAt(0) === "E") {
            setErrorMessage({
              error: true,
              type: "email_not_verified",
              message: t("error.email_not_verified"),
            });
            return;
          }
          // Else it's server error
          setErrorMessage({
            error: true,
            type: "server",
            message: t("error.server"),
          });
          return;
        }
        // If succeeds go back
        if (dt.status === 200) {
          router.push("/program");
        }
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
        setErrorMessage({
          error: true,
          type: "client",
          message: t("error.client"),
        });
        console.error("EMAIL CREDENTIAL CLIENT ERROR:", e);
        return;
      });
  };

  const firebaseAuth = async () => {
    setLoading(true);
    // Get accessToken
    const accessToken = await signUpWithGoogle();
    // If no accessToken return error
    if (!accessToken) {
      setLoading(false);
      setErrorMessage({
        error: true,
        type: "server",
        message: t("error.server"),
      });
      return;
    }
    signIn("firebase", { redirect: false, accessToken })
      .then((dt) => {
        setLoading(false);
        if (dt === undefined) {
          setErrorMessage({
            error: true,
            type: "server",
            message: t("error.server"),
          });
          return;
        }
        if (dt.error) {
          // Should only have 1 result: Credentials exist with email so i have to login using email
          const error = dt.error;
          if (error.charAt(0) === "P") {
            setErrorMessage({
              error: true,
              type: "credentials_exists",
              message: t("error.credentials_exists"),
            });
            return;
          }
          setErrorMessage({
            error: true,
            type: "server",
            message: t("error.server"),
          });
          return;
        }
        // If succeeds go back
        if (dt.status === 200) {
          router.push("/program");
        }
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
        console.error("FIREBASE AUTH CREDENTIAL CLIENT ERROR:", e);
      });
  };

  // Others
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const toggleLoginPage = () => {
    setLoginPage(!loginPage);
    setErrorMessage(errorMessageInit);
  };

  function LoginWithGoogle() {
    return (
      <>
        <div aria-label="title">
          <Typography component="h1" variant="h4" fontWeight="600" mb={1.5}>
            {t("title")}
          </Typography>
          <Typography component="h2" variant="h6">
            {t.rich("description", {
              strong: (chunks) => <strong>{chunks}</strong>,
            })}
          </Typography>
        </div>
        <Box component="form" sx={{ display: "flex", flexDirection: "column" }}>
          {/* The buttons have 1rem gap in each */}
          <Box
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
            aria-label="action buttons"
          >
            {errorMessage.error && (
              <Typography variant="caption" color="error">
                {errorMessage.message}
              </Typography>
            )}
            <TermsAndCondition />
            <LoadingButton
              loading={loading}
              aria-label={t("google")}
              type="button"
              fullWidth
              variant="contained"
              color="monochrome"
              sx={{ textTransform: "none", color: "black", boxShadow: 1 }}
              onClick={firebaseAuth}
              // disabled={true}
            >
              <span
                style={{
                  display: "inline-flex",
                  gap: "0.4rem",
                  alignItems: "center",
                }}
              >
                <LogoWrapper
                  src={GoogleSVG}
                  alt="Google Logo"
                  style={loading ? { display: "none" } : undefined}
                />
                {t("google")}
              </span>
            </LoadingButton>
          </Box>
        </Box>
      </>
    );
  }

  function LoginWithEmail() {
    return (
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        sx={{ display: "flex", flexDirection: "column" }}
      >
        <Input
          control={control}
          required
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
        />
        <PasswordInput
          name="password"
          control={control}
          handleClickShowPassword={handleClickShowPassword}
          showPassword={showPassword}
          formSx={{ mt: 3 }}
        />
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
            mt: 1,
          }}
        >
          <Link href="/reset-password" title={t("change_password")}>
            <Typography
              variant="caption"
              sx={{ textDecoration: "underline", color: "primary.main" }}
            >
              {t("forgot_password")}
            </Typography>
          </Link>
        </Box>
        {/* The buttons have 1rem gap in each */}
        <Box
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          aria-label="action buttons"
        >
          {errorMessage.error && (
            <Typography variant="caption" color="error">
              {errorMessage.message}
            </Typography>
          )}
          <LoadingButton
            // size="large"
            loading={loading}
            aria-label={t("google") + " email and password"}
            type="submit"
            fullWidth
            variant="contained"
          >
            Login
          </LoadingButton>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 3,
        maxWidth: "21rem",
      }}
    >
      {loginPage ? <LoginWithEmail /> : <LoginWithGoogle />}
      <UnderlinedLink
        href="#"
        sx={{ width: "fit-content", m: "auto" }}
        onClick={toggleLoginPage}
      >
        <Typography variant="h6">
          {t(!loginPage ? "switch_page.email" : "switch_page.google")}
        </Typography>
      </UnderlinedLink>
    </Box>
  );
}

function TermsAndCondition() {
  const t = useTranslations("signin.tnc");
  const [modalOpen, setModalOpen] = useState(false);
  const handleClose = () => setModalOpen(false);
  const handleOpen = () => setModalOpen(true);
  return (
    <Box>
      <Typography component="h4" variant="h6">
        {t("by_registering")}
      </Typography>
      <Box
        title={t("title")}
        aria-label="terms and conditions modal action"
        onClick={handleOpen}
        display="flex"
        flexDirection="row"
        color="primary.main"
        alignItems="center"
        gap={0.5}
        sx={{ cursor: "pointer" }}
      >
        <Typography
          sx={{ textDecoration: "underline" }}
          fontWeight={500}
          component="h4"
          variant="h6"
        >
          {t("tnc")}
        </Typography>
        <OpenInNewIcon fontSize="small" />
      </Box>
      <TermsAndConditionModal open={modalOpen} handleClose={handleClose} />
    </Box>
  );
}

type TermsAndConditionModalProps = {
  open: boolean;
  handleClose: () => void;
};

// Modal to show the T&C
function TermsAndConditionModal({
  open,
  handleClose,
}: TermsAndConditionModalProps) {
  const isDesktopRation = useDesktopRatio();
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="terms and condition modal"
      aria-describedby="read terms and condition"
    >
      <Box>
        <iframe
          src="/assets/terms-and-condition.html"
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

export async function getStaticProps({ locale }: { locale: "en" | "id" }) {
  return {
    props: {
      messages: (await import(`../locales/${locale}.json`)).default,
    },
  };
}
