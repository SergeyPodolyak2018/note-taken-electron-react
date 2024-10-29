import styles from './loader.module.scss';

export function Loader() {
  return (
    <div className={styles.mainContainer}>
      <span className={styles.loader}></span>
    </div>
  );
}
