import { AccountSettings } from '@aws-amplify/ui-react';
import { APP_NAME } from 'api/@constants';
import type { UserEntity } from 'api/@types/user';
import { signOut } from 'aws-amplify/auth';
import { Spacer } from 'components/Spacer';
import { HumanIcon } from 'components/icons/HumanIcon';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'components/modal/Modal';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
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

export const BasicHeader = (props: { user: UserEntity }) => {
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);
  const [openProfile, setOpenProfile] = useState(false);
  const [openPassword, setOpenPassword] = useState(false);

  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <span className={styles.appName}>{APP_NAME}</span>
        <div className={styles.btnContainer}>
          <div className={styles.userBtn} onClick={(e) => setAnchorEl(e.currentTarget)}>
            <HumanIcon size={18} fill="#336" />
            {props.user.signInName}
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
          <div>User name: {props.user.signInName}</div>
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
