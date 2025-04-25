import { Portal } from 'components/Portal';
import { Spacer } from 'components/Spacer';
import { Btn } from 'components/btn/Btn';
import type { PropsWithChildren } from 'react';
import styles from './Modal.module.css';

export const ModalHeader = (props: { text: string }) => {
  return <div className={styles.header}>{props.text}</div>;
};

export const ModalBody = (props: PropsWithChildren) => {
  return <div className={styles.body}>{props.children}</div>;
};

// eslint-disable-next-line complexity
export const ModalFooter = (
  props: { headerText?: string } & (
    | { okText?: undefined }
    | ({ okText: string; disabledOk?: boolean; ok: () => void } & (
        | { disabledOk?: undefined }
        | { disabledOk: boolean; disabledText?: string }
      ))
  ) &
    ({ cancelText?: undefined; cancel?: undefined } | { cancelText?: string; cancel: () => void }),
) => {
  return (
    <div className={styles.footer}>
      {props.okText !== undefined &&
        props.disabledOk === true &&
        props.disabledText !== undefined && (
          <>
            <div className={styles.warning}>{props.disabledText}</div>
            <Spacer axis="y" size={12} />
          </>
        )}
      {props.headerText !== undefined && (
        <>
          <div className={styles.footerText}>{props.headerText}</div>
          <Spacer axis="y" size={12} />
        </>
      )}
      {props.cancel && (
        <Btn size="small" text={props.cancelText ?? 'Cancel'} onClick={props.cancel} />
      )}
      {props.okText !== undefined && (
        <>
          <Spacer axis="x" size={16} />
          <Btn size="small" text={props.okText} disabled={props.disabledOk} onClick={props.ok} />
        </>
      )}
    </div>
  );
};

export const Modal = (props: PropsWithChildren<{ open: boolean; onClose?: () => void }>) => {
  return (
    <Portal>
      {props.open && (
        <div className={styles.container}>
          <div className={styles.background} onClick={props.onClose} />
          <div className={styles.card}>{props.children}</div>
        </div>
      )}
    </Portal>
  );
};
