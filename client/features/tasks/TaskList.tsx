import useAspidaSWR from '@aspida/swr';
import type { TaskDto } from 'common/types/task';
import { taskValidator } from 'common/validators/task';
import { Loading } from 'components/loading/Loading';
import { useAlert } from 'hooks/useAlert';
import type { FormEvent } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { apiClient } from 'utils/apiClient';
import { catchApiErr } from 'utils/catchApiErr';
import styles from './taskList.module.css';

export const TaskList = () => {
  const { setAlert } = useAlert();
  const { data: tasks, mutate: mutateTasks } = useAspidaSWR(apiClient.private.tasks, {
    refreshInterval: 5000,
  });
  const [label, setLabel] = useState('');
  const [image, setImage] = useState<File>();
  const previewImageUrl = useMemo(() => image && URL.createObjectURL(image), [image]);

  const createTask = async (e: FormEvent) => {
    e.preventDefault();

    const parsedLabel = taskValidator.createBodyBase.safeParse({ label });

    if (parsedLabel.error) {
      await setAlert(parsedLabel.error.issues[0]?.message ?? 'error');

      return;
    }

    const res = await apiClient.private.tasks
      .$post({ body: { label: parsedLabel.data.label, image } })
      .catch(catchApiErr);

    if (!res) return;

    setLabel('');
    setImage(undefined);

    await mutateTasks((tasks) => [res, ...(tasks ?? [])]);
  };

  const selectImage = (el: HTMLInputElement) => {
    setImage(el.files?.[0]);
    el.value = '';
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
            <div className={styles.fileInputContainer}>
              <input type="button" value="画像を選択" className={styles.btn} />
              <input
                type="file"
                className={styles.fileInput}
                accept=".png,.jpg,.jpeg,.gif,.webp,.svg"
                onChange={(e) => selectImage(e.target)}
              />
            </div>
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
