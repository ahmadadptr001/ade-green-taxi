'use client';

import React, { useState, useEffect } from 'react';
import { EditorState, ContentState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraftjs from 'html-to-draftjs';

// Import CSS-nya di sini
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

const DraftEditor = ({ initialHtml, onChange }) => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Konversi HTML string ke Draft State saat pertama kali mount
    const contentBlock = htmlToDraftjs(initialHtml || '');
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(
        contentBlock.contentBlocks
      );
      setEditorState(EditorState.createWithContent(contentState));
    }
    setIsReady(true);
  }, []); // Hanya jalan sekali saat component ini muncul

  const onEditorStateChange = (newState) => {
    setEditorState(newState);
    // Kirim balik HTML-nya ke parent
    const html = draftToHtml(convertToRaw(newState.getCurrentContent()));
    onChange(html);
  };

  if (!isReady)
    return <div className="h-[300px] bg-gray-50 animate-pulse rounded-md" />;

  return (
    <div className="border rounded-md p-2 bg-white">
      <Editor
        editorState={editorState}
        onEditorStateChange={onEditorStateChange}
        wrapperClassName="w-full"
        editorClassName="min-h-[300px] px-2"
        toolbar={{
          options: ['inline', 'blockType', 'list', 'textAlign', 'history'],
        }}
      />
    </div>
  );
};

export default DraftEditor;
