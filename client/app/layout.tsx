'use client';

import { Authenticator, translations } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { Amplify } from 'aws-amplify';
import { I18n } from 'aws-amplify/utils';
import { APP_NAME } from 'common/constants';
import { AuthLoader } from 'features/auth/AuthLoader';
import { Suspense } from 'react';
import 'styles/globals.css';
import { staticPath } from 'utils/$path';
import {
  NEXT_PUBLIC_COGNITO_POOL_ENDPOINT,
  NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID,
  NEXT_PUBLIC_COGNITO_USER_POOL_ID,
  NEXT_PUBLIC_OAUTH_DOMAIN,
} from 'utils/envValues';

if (typeof window !== 'undefined') {
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

  const lang = navigator.language.split('-')[0];

  if (lang) I18n.setLanguage(lang);
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head>
        <title>{APP_NAME}</title>
        <meta name="robots" content="noindex,nofollow" />
        <meta name="description" content={APP_NAME} />
        <link rel="icon" href={staticPath.favicon_png} />
      </head>
      <body>
        <Authenticator.Provider>
          <AuthLoader />
          <Suspense>{children}</Suspense>
        </Authenticator.Provider>
      </body>
    </html>
  );
}
