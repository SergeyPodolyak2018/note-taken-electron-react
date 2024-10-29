import './tipTap.scss';
import Document from '@tiptap/extension-document';
import Dropcursor from '@tiptap/extension-dropcursor';
import Image from '@tiptap/extension-image';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import { EditorContent, useEditor } from '@tiptap/react';
import { MouseEvent, useRef, useState } from 'react';
import { AddImagePopUp } from '../popups/addImagePopUp/addImagePopUp';
import { useOutsideClick } from '../../hooks/useOutsideClick';

export default (props: { content: string; save: (data: string) => void }) => {
  const [showPrompt, setShowPrompt] = useState<boolean>(false);
  const ref = useRef(null);
  const saveData = () => {
    const contentHtml = editor?.getHTML() || '';

    props.save(contentHtml);
  };

  const editor = useEditor({
    extensions: [Document, Paragraph, Text, Image, Dropcursor],
    content: props.content,
  });

  const showPromt = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setShowPrompt(true);
  };

  const addImage = (url: string) => {
    if (url) {
      //@ts-ignore
      editor?.chain().focus().setImage({ src: url }).run();
      setShowPrompt(false);
    }
  };

  if (!editor) {
    return null;
  }
  useOutsideClick(saveData, ref);

  return (
    <div
      ref={ref}
      className='tiptapmainContainer'
    >
      <div className='control-group'>
        {showPrompt && (
          <AddImagePopUp
            add={addImage}
            close={() => {
              setShowPrompt(false);
            }}
          />
        )}
        <div className='button-group'>
          <button onClick={showPromt}>Add image from URL</button>
        </div>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
};
