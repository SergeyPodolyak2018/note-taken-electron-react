import { useEffect, useRef, useState } from 'react';
import { TNote } from '../../../electron/Database/definitions/definitions.ts';
import { TNoteUI } from '../../definitions/main';
import styles from './note.module.scss';
import { DeleteButton } from '../buttons/deleteButton/deleteButton';
import Tiptap from '../tipTap/tipTap';
import parse from 'html-react-parser';

export function Note(props: {
  data: TNoteUI;
  update: (data: TNote) => void;
  delete: (id: number) => void;
}) {
  const [titleChange, setTitleChange] = useState(false);
  const [contentCange, setContentChange] = useState(false);
  const [title, setTitle] = useState(props.data.title);
  const ref = useRef(null);
  useEffect(() => {
    setTitleChange(false);
  }, [props.data]);

  const apdateAction = () => {
    props.update({
      title,
      content: props.data.content,
      id: props.data.id,
      created_time: props.data.created_time,
    });
    setTitleChange(false);
  };
  const apdateContentAction = (data: string) => {
    props.update({
      title,
      content: data,
      id: props.data.id,
      created_time: props.data.created_time,
    });
    setContentChange(false);
  };

  return (
    <div
      className={`${styles.wrapper} ${title === '' ? styles.notFinished : ''}`}
    >
      <div
        data-testid='note-header'
        className={styles.header}
      >
        <div
          className={styles.titleWrapper}
          onClick={() => {
            setTitleChange(true);
          }}
        >
          {!titleChange ? (
            title === '' ? (
              'Enter note title here'
            ) : (
              title
            )
          ) : (
            <input
              className={styles.customInput}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={apdateAction}
              placeholder='Enter note title here'
            ></input>
          )}
        </div>
        <DeleteButton
          action={() => {
            props.delete(props.data.id);
          }}
        />
      </div>
      <div
        data-testid='note-body'
        onClick={() => {
          setContentChange(true);
        }}
        className={`${styles.body} ${
          contentCange ? styles.contentRedactor : ''
        }`}
        ref={ref}
      >
        {contentCange ? (
          <Tiptap
            content={props.data.content}
            save={apdateContentAction}
          />
        ) : (
          parse(props.data.content)
        )}
      </div>
    </div>
  );
}
