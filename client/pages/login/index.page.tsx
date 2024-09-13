import { Authenticator } from '@aws-amplify/ui-react';
import { signUp } from 'aws-amplify/auth';
import { APP_NAME } from 'common/constants';
import { Spacer } from 'components/Spacer';
import { Loading } from 'components/loading/Loading';
import { useUser } from 'hooks/useUser';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { pagesPath, staticPath } from 'utils/$path';
import { NEXT_PUBLIC_OAUTH_DOMAIN } from 'utils/envValues';
import styles from './index.module.css';

const Login = () => {
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user.data !== null) router.replace(pagesPath.$url());
  }, [user, router]);

  return (
    <div
      className={styles.container}
      style={{ background: `center/cover url('${staticPath.images.bg_jpg}')` }}
    >
      {user.inited && user.data === null ? (
        <div className={styles.main}>
          <div className={styles.title}>{APP_NAME}</div>
          <Spacer axis="y" size={36} />
          <Authenticator
            signUpAttributes={['email']}
            socialProviders={NEXT_PUBLIC_OAUTH_DOMAIN === undefined ? undefined : ['google']}
            services={{
              handleSignUp: (input) =>
                signUp({
                  ...input,
                  options: {
                    userAttributes: { ...input.options?.userAttributes },
                    ...input.options,
                    autoSignIn: true,
                  },
                }),
            }}
          />
          <Spacer axis="y" size={60} />
        </div>
      ) : (
        <Loading visible />
      )}
      <div className={styles.credit}>
        <a
          className={styles.link}
          href="https://www.freepik.com/free-vector/gradient-blue-background_23985231.htm"
          target="_brank"
          title="Freepik | Create great designs, faster"
        >
          Image by freepik
        </a>
      </div>
    </div>
  );
};

export default Login;
