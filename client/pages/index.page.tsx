import { TaskList } from 'features/tasks/TaskList';
import { Layout } from 'layouts/Layout';
import styles from './index.module.css';

const Home = () => {
  return (
    <Layout
      render={(user) => (
        <div className={styles.container}>
          <div className={styles.title}>Hello {user.displayName}!</div>
          <TaskList />
        </div>
      )}
    />
  );
};

export default Home;
