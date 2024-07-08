import { Modal, ModalBody, ModalFooter } from 'components/modal/Modal';
import { atom, useAtom } from 'jotai';
import { useCallback } from 'react';

const alertAtom = atom<{ text: string | null; resolve: null | (() => void) }>({
  text: null,
  resolve: null,
});

export const useAlert = () => {
  const [alertParams, setAlertParams] = useAtom(alertAtom);
  const setAlert = useCallback(
    (text: string) => {
      setAlertParams((params) => ({ ...params, text }));
      return new Promise<void>((resolve) => setAlertParams((params) => ({ ...params, resolve })));
    },
    [setAlertParams],
  );
  const agreeAlert = useCallback(() => {
    setAlertParams((params) => ({ ...params, text: null }));
    alertParams.resolve?.();
  }, [alertParams, setAlertParams]);

  return {
    alertElm: alertParams.text !== null && (
      <Modal open onClose={agreeAlert}>
        <ModalBody>
          <div style={{ whiteSpace: 'pre-wrap' }}>{alertParams.text}</div>
        </ModalBody>
        <ModalFooter okText="OK" ok={agreeAlert} />
      </Modal>
    ),
    setAlert,
  };
};
