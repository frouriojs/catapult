import { APP_NAME } from 'api/@constants';
import type { UserEntity } from 'api/@types/user';
import { signOut } from 'aws-amplify/auth';
import { useConfirm } from 'components/confirm/useConfirm';
import { HumanIcon } from 'components/icons/HumanIcon';
import styles from './BasicHeader.module.css';

export const BasicHeader = (props: { user: UserEntity }) => {
  const { setConfirm } = useConfirm();
  const onClick = async () => {
    const confirmed = await setConfirm(
      `ユーザー名: ${props.user.signInName}\nメールアドレス: ${props.user.email}\n\nサインアウトしますか？`,
    );

    if (confirmed) await signOut();
  };

  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <span className={styles.appName}>{APP_NAME}</span>
        <div className={styles.userBtn} onClick={onClick}>
          <HumanIcon size={18} fill="#336" />
          {props.user.signInName}
        </div>
      </div>
    </div>
  );
};
