import { AccountSettings } from '@aws-amplify/ui-react';
import { signOut } from 'aws-amplify/auth';
import { APP_NAME } from 'common/constants';
import type { UserDto } from 'common/types/user';
import { Spacer } from 'components/Spacer';
import { HumanIcon } from 'components/icons/HumanIcon';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'components/modal/Modal';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { pagesPath } from 'utils/$path';
import styles from './BasicHeader.module.css';

const Menu = ({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}) => {
  useEffect(() => {
    const handler = () => open && setTimeout(onClose, 0);

    window.addEventListener('click', handler, true);

    return () => window.removeEventListener('click', handler, true);
  }, [open, onClose]);

  return open && <div className={styles.menu}>{children}</div>;
};

const MenuItem = (props: { onClick: () => void; children: ReactNode }) => {
  return (
    <div className={styles.menuItem} onClick={props.onClick}>
      {props.children}
    </div>
  );
};

export const BasicHeader = (props: { user: UserDto }) => {
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);
  const [openProfile, setOpenProfile] = useState(false);
  const [openPassword, setOpenPassword] = useState(false);

  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <span className={styles.appName}>{APP_NAME}</span>
        <Spacer axis="x" size={20} />
        <Link className={styles.docLink} href={pagesPath.docs.$url()} target="_brank">
          API Docs
        </Link>
        <div className={styles.btnContainer}>
          <div className={styles.userBtn} onClick={(e) => setAnchorEl(e.currentTarget)}>
            {props.user.photoUrl ? (
              <div
                className={styles.photo}
                style={{ backgroundImage: `url(${props.user.photoUrl})` }}
              />
            ) : (
              <HumanIcon size={18} fill="#336" />
            )}
            {props.user.displayName}
          </div>
          <Menu open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
            <MenuItem onClick={() => setOpenProfile(true)}>Your profile</MenuItem>
            <MenuItem onClick={() => setOpenPassword(true)}>Change password</MenuItem>
            <MenuItem onClick={signOut}>Sign out</MenuItem>
          </Menu>
        </div>
      </div>
      <Modal open={openProfile} onClose={() => setOpenProfile(false)}>
        <ModalHeader text="Your profile" />
        <ModalBody>
          <div>Sign in name: {props.user.signInName}</div>
          <Spacer axis="y" size={8} />
          <div>Display name: {props.user.displayName}</div>
          <Spacer axis="y" size={8} />
          <div>Email: {props.user.email}</div>
        </ModalBody>
        <ModalFooter cancelText="Close" cancel={() => setOpenProfile(false)} />
      </Modal>
      <Modal open={openPassword} onClose={() => setOpenPassword(false)}>
        <ModalHeader text="Change password" />
        <ModalBody>
          <div className={styles.passwordContainer}>
            <AccountSettings.ChangePassword onSuccess={signOut} />
          </div>
        </ModalBody>
        <ModalFooter cancelText="Close" cancel={() => setOpenPassword(false)} />
      </Modal>
    </div>
  );
};
