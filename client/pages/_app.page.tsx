import { Authenticator, translations } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { Amplify } from 'aws-amplify';
import { I18n } from 'aws-amplify/utils';
import { APP_NAME } from 'common/constants';
import { AuthLoader } from 'features/auth/AuthLoader';
import type { AppProps } from 'next/app';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useEffect } from 'react';
import 'styles/globals.css';
import {
  NEXT_PUBLIC_COGNITO_POOL_ENDPOINT,
  NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID,
  NEXT_PUBLIC_COGNITO_USER_POOL_ID,
  NEXT_PUBLIC_OAUTH_DOMAIN,
} from 'utils/envValues';
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  const SafeHydrate = dynamic(() => import('../components/SafeHydrate'), { ssr: false });

  useEffect(() => {
    Amplify.configure({
      Auth: {
        Cognito: {
          userPoolEndpoint: NEXT_PUBLIC_COGNITO_POOL_ENDPOINT,
          userPoolId: NEXT_PUBLIC_COGNITO_USER_POOL_ID,
          userPoolClientId: NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID,
          loginWith:
            NEXT_PUBLIC_OAUTH_DOMAIN === undefined
              ? undefined
              : {
                  oauth: {
                    domain: NEXT_PUBLIC_OAUTH_DOMAIN,
                    scopes: ['openid', 'profile', 'aws.cognito.signin.user.admin'],
                    redirectSignIn: [location.origin],
                    redirectSignOut: [location.origin],
                    responseType: 'code',
                  },
                },
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
