import styles from './greatings.module.scss';

export function Greatings() {
  return (
    <div
      data-testid='notes-greatings'
      className={styles.wrapper}
    >
      You don't have any notes yet
    </div>
  );
}
