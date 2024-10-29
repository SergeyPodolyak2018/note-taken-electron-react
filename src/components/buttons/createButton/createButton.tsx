import styles from './createButton.module.scss';

export function CreateButton(props: { action: () => void }) {
  return (
    <div
      className={styles.wrapper}
      onClick={props.action}
    >
      + Create new note
    </div>
  );
}
