import { useEffect, useState } from 'react';
import styles from './Error500.module.css';

const Error500 = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`${styles.container} ${isLoading ? styles.loading : ''}`}>
      <h1>500</h1>
      <h2>Unexpected Error <br />Unable to Connect<b> :(</b></h2>
      <div className={styles.gears}>
        <div className={`${styles.gear} ${styles.one}`}>
          <div className={styles.bar}></div>
          <div className={styles.bar}></div>
          <div className={styles.bar}></div>
        </div>
        <div className={`${styles.gear} ${styles.two}`}>
          <div className={styles.bar}></div>
          <div className={styles.bar}></div>
          <div className={styles.bar}></div>
        </div>
        <div className={`${styles.gear} ${styles.three}`}>
          <div className={styles.bar}></div>
          <div className={styles.bar}></div>
          <div className={styles.bar}></div>
        </div>
      </div>
    </div>
  );
};

export default Error500; 