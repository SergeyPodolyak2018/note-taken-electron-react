import './App.css';
import { Greatings } from './components/greatings/greatings';
import { Header } from './components/header/header';
import { Loader } from './components/loader/loader';
import { NoteList } from './components/noteList/noteList';
import { useMain } from './hooks/useMain';

function App() {
  const { data, addNew, updateNote, deleteNote, status } = useMain();

  return (
    <>
      <div className='main_wrapper'>
        {status === 'loading' ? (
          <Loader />
        ) : (
          <>
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
          </>
        )}
      </div>
    </>
  );
}

export default App;
