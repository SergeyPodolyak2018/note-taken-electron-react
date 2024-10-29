import { CreateButton } from '../buttons/createButton/createButton';
import styles from './header.module.scss';

export function Header(props: { action: () => void }) {
  return (
    <div
      data-testid='notes-header'
      className={styles.wrapper}
    >
      <CreateButton action={props.action} />
    </div>
  );
}
