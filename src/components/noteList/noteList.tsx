import { TNoteUI } from '../../definitions/main';
import { Note } from '../note/note';
import styles from './noteList.module.scss';

export const NoteList = (props: {
  data: TNoteUI[];
  update: (data: TNoteUI) => void;
  delete: (id: number) => void;
}) => {
  return (
    <div
      data-testid='notes-list'
      className={styles.wrapper}
    >
      {props.data.map((el) => (
        <Note
          key={el.id}
          data={el}
          update={props.update}
          delete={props.delete}
        />
      ))}
    </div>
  );
};
