import { expect, it, describe, vi } from 'vitest';
import { render } from '@testing-library/react';
import * as useMain from '../src/hooks/useMain';

import App from '../src/App';
import { TNoteUI } from '../src/definitions/main';

describe('app', () => {
  const useNotesSpy = vi.spyOn(useMain, 'useMain');
  it('should render greatings', () => {
    const items: TNoteUI[] = [];
    useNotesSpy.mockReturnValue({
      status: 'loading',
      data: items,
      addNew: () => Promise.resolve(),
      //@ts-ignore
      deleteNote: (id: number) => Promise.resolve(),
      //@ts-ignore
      updateNote: (note: TNoteUI) => Promise.resolve(),
    });
    const { getByTestId, queryByTestId } = render(<App />);
    //console.log(getByTestId('notes-list'));
    expect(queryByTestId('notes-list')).toBeNull();
    expect(getByTestId('notes-greatings')).toBeDefined();
    expect(getByTestId('notes-header')).toBeDefined();
  });
  it('should render list', () => {
    const items: TNoteUI[] = [
      {
        id: 1,
        title: 'test',
        content: 'test content',
        created_time: 123,
      },
      {
        id: 2,
        title: 'test2',
        content: 'test content2',
        created_time: 123,
      },
    ];
    useNotesSpy.mockReturnValue({
      status: 'loading',
      data: items,
      addNew: () => Promise.resolve(),
      //@ts-ignore
      deleteNote: (id: number) => Promise.resolve(),
      //@ts-ignore
      updateNote: (note: TNoteUI) => Promise.resolve(),
    });
    const { getByTestId, queryByTestId } = render(<App />);
    //console.log(getByTestId('notes-list'));
    expect(getByTestId('notes-list')).toBeDefined();
    expect(queryByTestId('notes-greatings')).toBeNull();
    expect(getByTestId('notes-header')).toBeDefined();
  });
});
