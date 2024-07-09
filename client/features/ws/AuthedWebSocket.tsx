import { IS_PROD, WS_PATH, WS_PING, WS_PONG } from 'common/constants';
import type { WebSocketData } from 'common/types/websocket';
import { atom, useAtom } from 'jotai';
import { useEffect, useRef } from 'react';
import useWebSocket from 'react-use-websocket';
import { NEXT_PUBLIC_SERVER_PORT } from 'utils/envValues';

const wsAtom = atom<{ lastMsgsByDesc: WebSocketData[] }>({ lastMsgsByDesc: [] });

export const usePickedLastMsg = <T extends WebSocketData['type'][]>(
  msgTypes: T,
): { lastMsg: (WebSocketData & { type: T[number] }) | undefined } => {
  const [{ lastMsgsByDesc }] = useAtom(wsAtom);
  const lastMsg = lastMsgsByDesc.find((msg) => msgTypes.some((type) => msg.type === type));

  return { lastMsg };
};

export const AuthedWebSocket = () => {
  const [, setWs] = useAtom(wsAtom);
  const didUnmount = useRef(false);
  const { lastJsonMessage, getWebSocket } = useWebSocket<WebSocketData | null>(
    IS_PROD
      ? `wss://${location.host}${WS_PATH}`
      : `ws://${location.hostname}:${NEXT_PUBLIC_SERVER_PORT}${WS_PATH}`,
    {
      retryOnError: true,
      shouldReconnect: () => !didUnmount.current,
      heartbeat: { message: WS_PING, returnMessage: WS_PONG },
    },
  );

  useEffect(() => {
    if (lastJsonMessage === null) return;

    setWs(({ lastMsgsByDesc }) => ({
      lastMsgsByDesc: [
        lastJsonMessage,
        ...lastMsgsByDesc.filter((msg) => msg.type !== lastJsonMessage.type),
      ],
    }));
  }, [lastJsonMessage, setWs]);

  useEffect(() => {
    return () => {
      didUnmount.current = true;
      setWs(() => ({ lastMsgsByDesc: [] }));
      getWebSocket()?.close();
    };
  }, [getWebSocket, setWs]);

  return <></>;
};
