import "@/styles/globals.css";
import "/node_modules/flag-icons/css/flag-icons.min.css";
import type { AppProps } from "next/app";
import { NextIntlClientProvider } from "next-intl";
import { CacheProvider, EmotionCache } from "@emotion/react";
import { ThemeProvider } from "@mui/material/styles";
import createEmotionCache from "@/theme/createEmotionCache";
import { theme } from "@/theme/theme";
import { CssBaseline } from "@mui/material";
import Wrapper from "@/components/Wrapper";
import { SessionProvider } from "next-auth/react";
import { useRouter } from "next/router";
import NextNProgress from "nextjs-progressbar";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

export interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

export default function Pusakawan(props: MyAppProps) {
  // If there's no emotionCache rendered by the server, use the clientSideEmotionCache
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  const router = useRouter();
  return (
    <CacheProvider value={emotionCache}>
      <ThemeProvider theme={theme}>
        <NextIntlClientProvider
          locale={router.locale}
          messages={pageProps.messages}
        >
          <CssBaseline />
          <SessionProvider session={pageProps.session}>
            <NextNProgress
              color="#AE1622"
              startPosition={0.3}
              stopDelayMs={400}
              height={4}
            />
            <Wrapper>
              <Component {...pageProps} />
              <SpeedInsights />
              <Analytics />
            </Wrapper>
          </SessionProvider>
        </NextIntlClientProvider>
      </ThemeProvider>
    </CacheProvider>
  );
}
