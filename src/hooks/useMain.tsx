import React from 'react';

import { AppContext } from '../store/store';
import { TNoteUI } from '../definitions/main';

export function useMain() {
  const globalState = React.useContext(AppContext);
  const { state, dispatch } = globalState;

  React.useEffect(() => {
    dispatch({
      type: 'SET_LOADING',
      payload: 'loading',
    });
    //@ts-ignore
    getAllNotes();
  }, []);
  async function getAllNotes() {
    //@ts-ignore
    const data = await window.ipcRenderer?.getAllNotes();
    dispatch({
      type: 'ADD_All_DATA',
      payload: data,
    });
  }

  const addNew = async () => {
    //@ts-ignore
    const data = await window.ipcRenderer
      //@ts-ignore
      .insertNote({
        title: '',
        content: '',
      });
    dispatch({
      type: 'ADD_ONE',
      payload: data,
    });
  };

  const deleteNote = async (id: number) => {
    //@ts-ignore
    const data = await window.ipcRenderer
      //@ts-ignore
      .deleteNote(id);
    await getAllNotes();
  };
  const updateNote = async (note: TNoteUI) => {
    //@ts-ignore
    const data = await window.ipcRenderer
      //@ts-ignore
      .updateNote({
        ...note,
      });
    dispatch({
      type: 'UPDATE_ONE',
      payload: data,
    });
  };

  return {
    ...state.main,
    addNew,
    deleteNote,
    updateNote,
  };
}
