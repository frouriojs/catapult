import { Authenticator } from '@aws-amplify/ui-react';
import { APP_NAME } from 'api/@constants';
import { signUp } from 'aws-amplify/auth';
import { Spacer } from 'components/Spacer';
import { useUser } from 'components/auth/useUser';
import { Loading } from 'components/loading/Loading';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { pagesPath, staticPath } from 'utils/$path';
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
      style={{ background: `center/cover url('${staticPath.images.odaiba_jpg}')` }}
    >
      {user.inited && user.data === null ? (
        <div className={styles.main}>
          <div className={styles.title}>{APP_NAME}</div>
          <Spacer axis="y" size={24} />
          <Authenticator
            signUpAttributes={['email']}
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
          <Spacer axis="y" size={40} />
        </div>
      ) : (
        <Loading visible />
      )}
    </div>
  );
};

export default Login;
