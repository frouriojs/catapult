import type { TaskEntity } from 'api/@types/task';
import type { UserEntity } from 'api/@types/user';
import { Loading } from 'components/loading/Loading';
import { useCatchApiErr } from 'hooks/useCatchApiErr';
import { Layout } from 'layouts/Layout';
import type { FormEvent } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { apiClient } from 'utils/apiClient';
import styles from './index.module.css';

const Main = (props: { user: UserEntity }) => {
  const catchApiErr = useCatchApiErr();
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [tasks, setTasks] = useState<TaskEntity[]>();
  const [label, setLabel] = useState('');
  const [image, setImage] = useState<File>();
  const [previewImageUrl, setPreviewImageUrl] = useState<string>();
  const fetchTasks = useCallback(async () => {
    await apiClient.private.tasks.$get().then(setTasks).catch(catchApiErr);
  }, [catchApiErr]);
  const createTask = async (e: FormEvent) => {
    e.preventDefault();
    if (!fileRef.current) return;

    await apiClient.private.tasks.post({ body: { label, image } }).catch(catchApiErr);
    setLabel('');
    setImage(undefined);
    setPreviewImageUrl(undefined);
    fileRef.current.value = '';
    await fetchTasks();
  };
  const toggleDone = async (task: TaskEntity) => {
    await apiClient.private.tasks
      ._taskId(task.id)
      .patch({ body: { done: !task.done } })
      .catch(catchApiErr);
    await fetchTasks();
  };
  const deleteTask = async (task: TaskEntity) => {
    await apiClient.private.tasks._taskId(task.id).delete().catch(catchApiErr);
    await fetchTasks();
  };

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

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
