import { Button, TextField, View } from '@aws-amplify/ui-react';
import {
  fetchMFAPreference,
  setUpTOTP,
  updateMFAPreference,
  verifyTOTPSetup,
} from 'aws-amplify/auth';
import { APP_NAME } from 'common/constants';
import type { UserDto } from 'common/types/user';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'components/modal/Modal';
import { Spacer } from 'components/Spacer';
import { useEffect, useState } from 'react';

export const YourProfile = (props: { user: UserDto; onClose: () => void }) => {
  const [enabledTotp, setEnabledTotp] = useState<boolean>();
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [totpCode, setTotpCode] = useState('');
  const enableTOTP = async () => {
    const totpSetupDetails = await setUpTOTP();
    const setupUri = totpSetupDetails.getSetupUri(APP_NAME);

    setQrCodeUrl(setupUri.toString());
  };
  const verifyTOTP = async () => {
    await verifyTOTPSetup({ code: totpCode });
    await updateMFAPreference({ totp: 'PREFERRED' });
    alert('TOTP has been successfully enabled!');
    setQrCodeUrl('');
  };

  useEffect(() => {
    fetchMFAPreference().then((res) => {
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
        <div>Email: {props.user.email}</div>
        <Spacer axis="y" size={8} />
        {enabledTotp ? (
          <div>MFA: true</div>
        ) : qrCodeUrl ? (
          <View>
            <p>Scan this QR code with your authenticator app:</p>
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(
                qrCodeUrl,
              )}`}
              alt="TOTP QR Code"
              style={{ padding: 16, width: 150 }}
            />
            <TextField
              label="Enter TOTP Code"
              placeholder="123456"
              value={totpCode}
              onChange={(e) => setTotpCode(e.target.value)}
            />
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
