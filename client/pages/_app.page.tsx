import { Authenticator, translations } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { APP_NAME } from 'api/@constants';
import { Amplify } from 'aws-amplify';
import { I18n } from 'aws-amplify/utils';
import { AuthLoader } from 'components/auth/AuthLoader';
import type { AppProps } from 'next/app';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import 'styles/globals.css';
import {
  COGNITO_USER_POOL_CLIENT_ID,
  COGNITO_USER_POOL_ID,
  NEXT_PUBLIC_COGNITO_POOL_ENDPOINT,
} from 'utils/envValues';
import { gaPageview } from 'utils/gtag';
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  const SafeHydrate = dynamic(() => import('../components/SafeHydrate'), { ssr: false });
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url: string, { shallow }: { shallow: boolean }) => {
      if (!shallow) gaPageview(url);
    };

    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  useEffect(() => {
    Amplify.configure({
      Auth: {
        Cognito: {
          userPoolEndpoint: NEXT_PUBLIC_COGNITO_POOL_ENDPOINT,
          userPoolId: COGNITO_USER_POOL_ID,
          userPoolClientId: COGNITO_USER_POOL_CLIENT_ID,
        },
      },
    });

    I18n.putVocabularies(translations);
    I18n.setLanguage(navigator.language.split('-')[0]);
  }, []);

  return (
    <>
      <Head>
        <title>{APP_NAME}</title>
      </Head>
      <SafeHydrate>
        <Authenticator.Provider>
          <AuthLoader />
          <Component {...pageProps} />
        </Authenticator.Provider>
      </SafeHydrate>
    </>
  );
}

export default MyApp;
