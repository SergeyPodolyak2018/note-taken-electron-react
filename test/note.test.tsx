import { expect, it, describe, vi } from 'vitest';
import { render } from '@testing-library/react';

import { Note } from '../src/components/note/note';
import { TNoteUI } from '../src/definitions/main';

describe('Note', () => {
  it('should render empty note', () => {
    const data = {
      id: 1,
      title: '',
      content: '',
      created_time: 123,
    };
    const { getByTestId, getByText } = render(
      <Note
        data={data}
        //@ts-ignore
        update={(data: TNoteUI) => {}}
        //@ts-ignore
        delete={(id: number) => {}}
      />
    );
    expect(getByTestId('notes-delete-button')).toBeDefined();
    expect(getByTestId('note-header')).toBeDefined();
    expect(getByTestId('note-body')).toBeDefined();
    expect(getByText('Enter note title here')).toBeDefined();
  });
  it('should render Note', () => {
    const data = {
      id: 1,
      title: 'test',
      content: 'test content',
      created_time: 123,
    };
    const { getByTestId } = render(
      <Note
        data={data}
        //@ts-ignore
        update={(data: TNoteUI) => {}}
        //@ts-ignore
        delete={(id: number) => {}}
      />
    );
    expect(getByTestId('notes-delete-button')).toBeDefined();
    expect(getByTestId('note-header')).toBeDefined();
    expect(getByTestId('note-body')).toBeDefined();
  });
  it('should click on delete button', async () => {
    const data = {
      id: 1,
      title: 'test',
      content: 'test content',
      created_time: 123,
    };
    //@ts-ignore
    const deleteCallback = vi.fn().mockImplementation((data: TNoteUI) => {});
    //@ts-ignore
    const updateCallback = vi.fn().mockImplementation((id: number) => {});
    const { getByTestId } = render(
      <Note
        data={data}
        update={updateCallback}
        delete={deleteCallback}
      />
    );
    const button = getByTestId('notes-delete-button');
    expect(button).toBeDefined();
    await button.click();
    expect(deleteCallback).toHaveBeenCalledTimes(1);
    expect(deleteCallback).toBeCalledWith(1);
  });
});
