import styles from './deleteButton.module.scss';

export function DeleteButton(props: { action: () => void }) {
  return (
    <div
      data-testid='notes-delete-button'
      className={styles.wrapper}
      onClick={props.action}
    >
      x
    </div>
  );
}
