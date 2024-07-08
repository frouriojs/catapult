import { Modal, ModalBody, ModalFooter } from 'components/modal/Modal';
import { atom, useAtom } from 'jotai';
import { useCallback } from 'react';

const confirmAtom = atom<{ text: string | null; resolve: null | ((val: boolean) => void) }>({
  text: null,
  resolve: null,
});

export const useConfirm = () => {
  const [confirmParams, setConfirmParams] = useAtom(confirmAtom);
  const setConfirm = useCallback(
    (text: string) => {
      setConfirmParams((params) => ({ ...params, text }));
      return new Promise<boolean>((resolve) =>
        setConfirmParams((params) => ({ ...params, resolve })),
      );
    },
    [setConfirmParams],
  );
  const agreeConfirm = useCallback(() => {
    setConfirmParams((params) => ({ ...params, text: null }));
    confirmParams.resolve?.(true);
  }, [confirmParams, setConfirmParams]);
  const cancelConfirm = useCallback(() => {
    setConfirmParams((params) => ({ ...params, text: null }));
    confirmParams.resolve?.(false);
  }, [confirmParams, setConfirmParams]);

  return {
    confirmElm: confirmParams.text !== null && (
      <Modal open onClose={cancelConfirm}>
        <ModalBody>
          <div style={{ whiteSpace: 'pre-wrap' }}>{confirmParams.text}</div>
        </ModalBody>
        <ModalFooter cancel={cancelConfirm} okText="OK" ok={agreeConfirm} />
      </Modal>
    ),
    setConfirm,
  };
};
