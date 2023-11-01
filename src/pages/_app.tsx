import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { NextIntlClientProvider } from 'next-intl';
import { CacheProvider, EmotionCache } from "@emotion/react";
import { ThemeProvider } from "@mui/material/styles";
import createEmotionCache from '@/theme/createEmotionCache';
import { theme } from '@/theme/theme';
import { CssBaseline } from '@mui/material';
import Wrapper from '@/components/Wrapper';

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

export interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

export default function MyApp(props: MyAppProps) {
  // If there's no emotionCache rendered by the server, use the clientSideEmotionCache
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  return (
    <CacheProvider value={emotionCache}>
      <ThemeProvider theme={theme}>
        <NextIntlClientProvider messages={pageProps.messages}>
          <CssBaseline />
          <Wrapper>
            <Component {...pageProps} />
          </Wrapper>
        </NextIntlClientProvider>
      </ThemeProvider>
    </CacheProvider>
  )
}
