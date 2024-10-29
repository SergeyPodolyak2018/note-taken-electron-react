import './App.css';
import { Greatings } from './components/greatings/greatings';
import { Header } from './components/header/header';
import { NoteList } from './components/noteList/noteList';
import { useMain } from './hooks/useMain';

function App() {
  const { data, addNew, updateNote, deleteNote } = useMain();

  return (
    <>
      <div className='main_wrapper'>
        <Header action={addNew} />
        {data.length === 0 ? (
          <Greatings />
        ) : (
          <NoteList
            data={data}
            update={updateNote}
            delete={deleteNote}
          />
        )}
      </div>
    </>
  );
}

export default App;
