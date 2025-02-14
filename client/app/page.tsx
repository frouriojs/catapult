'use client';

import { TaskList } from 'features/tasks/TaskList';
import { PageLayout } from 'layouts/PageLayout';
import styles from './page.module.css';

export default function Home() {
  return (
    <PageLayout
      render={(user) => (
        <div className={styles.container}>
          <div className={styles.title}>Hello {user.displayName}!</div>
          <TaskList />
        </div>
      )}
    />
  );
}
