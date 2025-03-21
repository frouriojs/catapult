import { Button, TextField, View } from '@aws-amplify/ui-react';
import {
  fetchMFAPreference,
  setUpTOTP,
  updateMFAPreference,
  updateUserAttribute,
  verifyTOTPSetup,
} from 'aws-amplify/auth';
import { APP_NAME } from 'common/constants';
import type { UserDto } from 'common/types/user';
import { Btn } from 'components/btn/Btn';
import { useLoading } from 'components/loading/useLoading';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'components/modal/Modal';
import { Spacer } from 'components/Spacer';
import { useUser } from 'hooks/useUser';
import QRCode from 'qrcode';
import { useEffect, useState } from 'react';
import { apiClient } from 'utils/apiClient';
import { catchApiErr } from 'utils/catchApiErr';
import { z } from 'zod';

export const YourProfile = (props: { user: UserDto; onClose: () => void }) => {
  const { setUser } = useUser();
  const { setLoading } = useLoading();
  const [enabledTotp, setEnabledTotp] = useState<boolean>();
  const [qrDataURL, setQrDataURL] = useState<string | null>(null);
  const [totpCode, setTotpCode] = useState('');
  const [email, setEmail] = useState(props.user.email);
  const [emailCode, setEmailCode] = useState<string>();
  const enableTOTP = async () => {
    const totpSetupDetails = await setUpTOTP();
    const setupUri = totpSetupDetails.getSetupUri(APP_NAME, props.user.signInName);

    await QRCode.toDataURL(setupUri.toString(), { width: 160 }).then(setQrDataURL);
  };
  const disableTOTP = async () => {
    await updateMFAPreference({ totp: 'DISABLED' });

    setEnabledTotp(false);
    alert('TOTP has been successfully disabled!');
  };
  const verifyTOTP = async () => {
    await verifyTOTPSetup({ code: totpCode });
    await updateMFAPreference({ totp: 'PREFERRED' });

    alert('TOTP has been successfully enabled!');
    setQrDataURL(null);
    setEnabledTotp(true);
  };
  const updateEmail = async () => {
    setLoading(true);

    const res = await updateUserAttribute({
      userAttribute: { attributeKey: 'email', value: email },
    }).catch(catchApiErr);

    setLoading(false);

    if (!res) return;

    setEmailCode('');
  };
  const confirmEmail = async () => {
    if (!emailCode) return;

    setLoading(true);

    await apiClient.private.me.email
      .$post({ body: { code: emailCode } })
      .then(setUser)
      .catch(catchApiErr);

    setLoading(false);
    setEmailCode(undefined);
  };

  useEffect(() => {
    void fetchMFAPreference().then((res) => {
      setEnabledTotp(res.preferred === 'TOTP');
    });
  }, []);

  return (
    <Modal open onClose={props.onClose}>
      <ModalHeader text="Your profile" />
      <ModalBody>
        <div>Sign in name: {props.user.signInName}</div>
        <Spacer axis="y" size={8} />
        <div>Display name: {props.user.displayName}</div>
        <Spacer axis="y" size={8} />
        <div style={{ minWidth: 400 }}>
          <TextField
            type="email"
            label="Email"
            size="small"
            disabled={emailCode !== undefined}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Spacer axis="y" size={12} />
          {emailCode === undefined ? (
            <div style={{ textAlign: 'right' }}>
              <Btn
                size="small"
                text="SAVE"
                disabled={
                  !z.string().email().safeParse(email).success || props.user.email === email
                }
                onClick={updateEmail}
              />
            </div>
          ) : (
            <>
              <TextField
                label="Confirmation code"
                size="small"
                value={emailCode}
                onChange={(e) => setEmailCode(e.target.value)}
              />
              <Spacer axis="y" size={12} />
              <div style={{ textAlign: 'right' }}>
                <Btn size="small" text="SEND" disabled={!emailCode} onClick={confirmEmail} />
              </div>
            </>
          )}
        </div>
        <Spacer axis="y" size={8} />
        {enabledTotp ? (
          <Button size="small" onClick={disableTOTP}>
            Disable TOTP
          </Button>
        ) : qrDataURL ? (
          <View>
            <p>Scan this QR code with your authenticator app:</p>
            <img src={qrDataURL} alt="TOTP QR Code" />
            <TextField
              label="Enter TOTP Code"
              placeholder="123456"
              size="small"
              value={totpCode}
              onChange={(e) => setTotpCode(e.target.value)}
            />
            <Spacer axis="y" size={8} />
            <Button onClick={verifyTOTP}>Verify TOTP</Button>
          </View>
        ) : (
          <Button size="small" onClick={enableTOTP}>
            Enable TOTP
          </Button>
        )}
      </ModalBody>
      <ModalFooter cancelText="Close" cancel={props.onClose} />
    </Modal>
  );
};
