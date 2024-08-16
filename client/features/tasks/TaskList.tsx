import useAspidaSWR from '@aspida/swr';
import type { TaskDto } from 'common/types/task';
import { labelValidator } from 'common/validators/task';
import { Loading } from 'components/loading/Loading';
import { useAlert } from 'hooks/useAlert';
import type { FormEvent } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { apiClient } from 'utils/apiClient';
import { catchApiErr } from 'utils/catchApiErr';
import styles from './taskList.module.css';

export const TaskList = () => {
  const { setAlert } = useAlert();
  const { data: tasks, mutate: mutateTasks } = useAspidaSWR(apiClient.private.tasks, {
    refreshInterval: 5000,
  });
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [label, setLabel] = useState('');
  const [image, setImage] = useState<File>();
  const previewImageUrl = useMemo(() => image && URL.createObjectURL(image), [image]);

  const createTask = async (e: FormEvent) => {
    e.preventDefault();

    const parsedLabel = labelValidator.safeParse(label);

    if (parsedLabel.error) {
      await setAlert(parsedLabel.error.issues[0].message);
      return;
    }

    await apiClient.private.tasks
      .$post({ body: { label: parsedLabel.data, image } })
      .then((task) => mutateTasks((tasks) => [task, ...(tasks ?? [])]))
      .catch(catchApiErr);
    setLabel('');
    setImage(undefined);

    if (fileRef.current) fileRef.current.value = '';
  };
  const toggleDone = async (task: TaskDto) => {
    await apiClient.private.tasks
      ._taskId(task.id)
      .$patch({ body: { done: !task.done } })
      .then((task) => mutateTasks((tasks) => tasks?.map((t) => (t.id === task.id ? task : t))))
      .catch(catchApiErr);
  };
  const deleteTask = async (task: TaskDto) => {
    await apiClient.private.tasks
      ._taskId(task.id)
      .$delete()
      .then((task) => mutateTasks((tasks) => tasks?.filter((t) => t.id !== task.id)))
      .catch(catchApiErr);
  };

  useEffect(() => {
    if (!previewImageUrl) return;

    return () => URL.revokeObjectURL(previewImageUrl);
  }, [previewImageUrl]);

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
