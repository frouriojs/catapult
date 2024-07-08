import type { TaskDto } from 'api/@types/task';
import { Loading } from 'components/loading/Loading';
import { usePickedLastMsg } from 'features/ws/AuthedWebSocket';
import { useCatchApiErr } from 'hooks/useCatchApiErr';
import type { FormEvent } from 'react';
import { useEffect, useRef, useState } from 'react';
import { apiClient } from 'utils/apiClient';
import styles from './taskList.module.css';

export const TaskList = () => {
  const catchApiErr = useCatchApiErr();
  const { lastMsg } = usePickedLastMsg(['taskCreated', 'taskUpdated']);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [tasks, setTasks] = useState<TaskDto[]>();
  const [label, setLabel] = useState('');
  const [image, setImage] = useState<File>();
  const [previewImageUrl, setPreviewImageUrl] = useState<string>();

  const createTask = async (e: FormEvent) => {
    e.preventDefault();
    if (!fileRef.current) return;

    await apiClient.private.tasks
      .$post({ body: { label, image } })
      .then((task) => setTasks((tasks) => [task, ...(tasks ?? [])]))
      .catch(catchApiErr);
    setLabel('');
    setImage(undefined);
    setPreviewImageUrl(undefined);
    fileRef.current.value = '';
  };
  const toggleDone = async (task: TaskDto) => {
    await apiClient.private.tasks
      ._taskId(task.id)
      .$patch({ body: { done: !task.done } })
      .then((task) => setTasks((tasks) => tasks?.map((t) => (t.id === task.id ? task : t))))
      .catch(catchApiErr);
  };
  const deleteTask = async (task: TaskDto) => {
    await apiClient.private.tasks
      ._taskId(task.id)
      .$delete()
      .then((task) => setTasks((tasks) => tasks?.filter((t) => t.id !== task.id)))
      .catch(catchApiErr);
  };

  useEffect(() => {
    if (tasks !== undefined) return;

    apiClient.private.tasks.$get().then(setTasks).catch(catchApiErr);
  }, [tasks, catchApiErr]);

  useEffect(() => {
    if (lastMsg === undefined) return;

    switch (lastMsg.type) {
      case 'taskCreated':
      case 'taskUpdated':
        console.log(lastMsg);
        return;
      /* v8 ignore next 2 */
      default:
        throw new Error(lastMsg satisfies never);
    }
  }, [lastMsg]);

  useEffect(() => {
    if (!image) return;

    const newUrl = URL.createObjectURL(image);
    setPreviewImageUrl(newUrl);

    return () => URL.revokeObjectURL(newUrl);
  }, [image]);

  if (!tasks) return <Loading visible />;

  return (
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
          {task.image && <img src={task.image.url} alt={task.label} className={styles.taskImage} />}
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
  );
};
