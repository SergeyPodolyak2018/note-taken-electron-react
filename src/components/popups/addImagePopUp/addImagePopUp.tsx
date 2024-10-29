import { useState } from 'react';
import styles from './addImagePopUp.module.scss';

export function AddImagePopUp(props: {
  add: (data: string) => void;
  close: () => void;
}) {
  const [url, setUrl] = useState('');
  return (
    <div className={styles.mainContainer}>
      <div>
        Add image url:
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        ></input>
      </div>
      <div className={styles.actionContainer}>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            props.add(url);
          }}
        >
          Add
        </button>{' '}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            props.close();
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
}
