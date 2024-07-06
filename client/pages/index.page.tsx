import { WS_PATH } from 'api/@constants';
import type { TaskEntity, TaskEvent } from 'api/@types/task';
import type { UserEntity } from 'api/@types/user';
import { Loading } from 'components/loading/Loading';
import { useCatchApiErr } from 'hooks/useCatchApiErr';
import { Layout } from 'layouts/Layout';
import type { FormEvent } from 'react';
import { useEffect, useRef, useState } from 'react';
import useWebSocket from 'react-use-websocket';
import { apiClient } from 'utils/apiClient';
import { SERVER_PORT } from 'utils/envValues';
import styles from './index.module.css';

const Main = (props: { user: UserEntity }) => {
  const catchApiErr = useCatchApiErr();
  const { lastMessage } = useWebSocket(
    process.env.NODE_ENV === 'production'
      ? `wss://${location.host}${WS_PATH}`
      : `ws://localhost:${SERVER_PORT}${WS_PATH}`,
  );
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [tasks, setTasks] = useState<TaskEntity[]>();
  const [label, setLabel] = useState('');
  const [image, setImage] = useState<File>();
  const [previewImageUrl, setPreviewImageUrl] = useState<string>();

  const createTask = async (e: FormEvent) => {
    e.preventDefault();
    if (!fileRef.current) return;

    await apiClient.private.tasks.post({ body: { label, image } }).catch(catchApiErr);
    setLabel('');
    setImage(undefined);
    setPreviewImageUrl(undefined);
    fileRef.current.value = '';
  };
  const toggleDone = async (task: TaskEntity) => {
    await apiClient.private.tasks
      ._taskId(task.id)
      .patch({ body: { done: !task.done } })
      .catch(catchApiErr);
  };
  const deleteTask = async (task: TaskEntity) => {
    await apiClient.private.tasks._taskId(task.id).delete().catch(catchApiErr);
  };

  useEffect(() => {
    if (tasks !== undefined) return;

    apiClient.private.tasks.$get().then(setTasks).catch(catchApiErr);
  }, [tasks, catchApiErr]);

  useEffect(() => {
    if (lastMessage === null) return;

    const event: TaskEvent = JSON.parse(lastMessage.data);

    switch (event.type) {
      case 'taskCreated':
        setTasks((tasks) => [event.task, ...(tasks ?? [])]);
        return;
      case 'taskUpdated':
        setTasks((tasks) => tasks?.map((t) => (t.id === event.task.id ? event.task : t)));
        return;
      case 'taskDeleted':
        setTasks((tasks) => tasks?.filter((t) => t.id !== event.taskId));
        return;
      /* v8 ignore next 2 */
      default:
        throw new Error(event satisfies never);
    }
  }, [lastMessage]);

  useEffect(() => {
    if (!image) return;

    const newUrl = URL.createObjectURL(image);
    setPreviewImageUrl(newUrl);

    return () => URL.revokeObjectURL(newUrl);
  }, [image]);

  if (!tasks) return <Loading visible />;

  return (
    <div className={styles.container}>
      <div className={styles.title}>Hello {props.user.signInName}!</div>
      <div className={styles.main}>
        <div className={styles.card}>
          {previewImageUrl && <img src={previewImageUrl} className={styles.taskImage} />}
          <form className={styles.form} onSubmit={createTask}>
            <input
              value={label}
              className={styles.textInput}
              type="text"
              placeholder="Todo task"
              onChange={(e) => setLabel(e.target.value)}
            />
            <div className={styles.controls}>
              <input
                type="file"
                ref={fileRef}
                accept=".png,.jpg,.jpeg,.gif,.webp,.svg"
                onChange={(e) => setImage(e.target.files?.[0])}
              />
              <input className={styles.btn} disabled={label === ''} type="submit" value="ADD" />
            </div>
          </form>
        </div>
        {tasks.map((task) => (
          <div key={task.id} className={styles.card}>
            {task.image && (
              <img src={task.image.url} alt={task.label} className={styles.taskImage} />
            )}
            <div className={styles.form}>
              <div className={styles.controls}>
                <input type="checkbox" checked={task.done} onChange={() => toggleDone(task)} />
                <span>{task.label}</span>
                <input
                  type="button"
                  value="DELETE"
                  className={styles.btn}
                  onClick={() => deleteTask(task)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Home = () => {
  return <Layout render={(user) => <Main user={user} />} />;
};

export default Home;
