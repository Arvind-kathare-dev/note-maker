'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Highlight from '@tiptap/extension-highlight';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Color from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import FontFamily from '@tiptap/extension-font-family';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import Typography from '@tiptap/extension-typography';
import { common, createLowlight } from 'lowlight';
import { Table } from '@tiptap/extension-table';
import TableHeader from '@tiptap/extension-table-header';
import TableRow from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { List } from 'lucide-react';
import { useEffect, useState } from 'react';
import EditorToolbar from './EditorToolbar';
import FloatingBubbleMenu from './FloatingBubbleMenu';
import { markdownToJSON } from '@/lib/converter';

const safeParseJSON = (content: string | undefined) => {
  if (!content) return '';
  try {
    return JSON.parse(content);
  } catch (e) {
    // If it's markdown, convert it
    if (content.startsWith('#') || content.includes('\n')) {
      try {
        return JSON.parse(markdownToJSON(content));
      } catch {
        return content;
      }
    }
    return content;
  }
};

const lowlight = createLowlight(common);

interface TipTapEditorProps {
  content?: string;
  onChange?: (content: string) => void;
  editable?: boolean;
  placeholder?: string;
}

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export default function TipTapEditor({ content, onChange, editable = true, placeholder }: TipTapEditorProps) {
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ codeBlock: false }),
      Placeholder.configure({ placeholder: placeholder || 'Start writing… (Markdown is supported)' }),
      Underline,
      Typography,
      TextStyle,
      Color,
      FontFamily,
      Subscript,
      Superscript,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Image.configure({ allowBase64: true, inline: true }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: 'editor-link', target: '_blank' },
      }),
      Highlight.configure({ multicolor: true }),
      TaskList,
      TaskItem.configure({ nested: true }),
      CodeBlockLowlight.configure({ lowlight }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: safeParseJSON(content),
    editable,
    onUpdate: ({ editor }) => {
      const text = editor.getText();
      setWordCount(countWords(text));
      setCharCount(text.length);
      onChange?.(JSON.stringify(editor.getJSON()));
    },
    editorProps: {
      attributes: {
        class: 'nexus-editor focus:outline-none',
      },
    },
  });

  useEffect(() => {
    if (!editor) return;
    editor.setEditable(editable);
  }, [editor, editable]);

  useEffect(() => {
    if (!editor || !content) return;
    const parsed = safeParseJSON(content);
    if (parsed && JSON.stringify(editor.getJSON()) !== JSON.stringify(parsed)) {
      editor.commands.setContent(parsed, { emitUpdate: false });
    }
  }, [content, editor]);

  useEffect(() => {
    if (!editor) return;
    const text = editor.getText();
    setWordCount(countWords(text));
    setCharCount(text.length);
  }, [editor]);

  if (!editor) return null;

  return (
    <div className="flex flex-col relative">
      {editable && (
        <div className="sticky top-6 z-20 flex justify-center w-full pointer-events-none transition-all mb-8">
          <div className="pointer-events-auto max-w-full px-4">
            <EditorToolbar editor={editor} />
          </div>
        </div>
      )}

      <div className="relative min-h-[500px] mt-4">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
