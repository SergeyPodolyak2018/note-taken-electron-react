import { expect, it, describe } from 'vitest';
import { render } from '@testing-library/react';

import { NoteList } from '../src/components/noteList/noteList';
import { TNoteUI } from '../src/definitions/main';

describe('noteList', () => {
  it('should render notes', () => {
    const items = [
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
    const { getByTestId } = render(
      <NoteList
        data={items}
        //@ts-ignore
        update={(data: TNoteUI) => {}}
        //@ts-ignore
        delete={(id: number) => {}}
      />
    );
    expect(getByTestId('notes-list').children.length).toBe(items.length);
  });
});
