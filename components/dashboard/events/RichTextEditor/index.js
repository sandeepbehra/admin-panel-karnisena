"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";


import {
  Table,
  TableRow,
  TableHeader,
  TableCell,
} from "@tiptap/extension-table";

import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading2,
  Heading3,
  TableIcon,
  Undo2,
  Redo2,
} from "lucide-react";

import { useEffect } from "react";

export default function RichTextEditor({
  value = "",
  onChange,
  placeholder = "Write content...",
}) {
  const editor = useEditor({
    immediatelyRender: false,

    extensions: [
      StarterKit,

      Table.configure({
        resizable: true,
      }),

      TableRow,
      TableHeader,
      TableCell,
    ],

    content: value,

    editorProps: {
      attributes: {
        class:
          "min-h-[260px] px-4 py-4 outline-none prose prose-sm max-w-none",
      },
    },

    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) return;

    const currentHTML =
      editor.getHTML();

    if (value !== currentHTML) {
      editor.commands.setContent(
        value || "",
        false
      );
    }
  }, [value, editor]);

  if (!editor) {
    return (
      <div className="h-[300px] animate-pulse rounded-xl bg-slate-100" />
    );
  }

  const addTable = () => {
    editor
      .chain()
      .focus()
      .insertTable({
        rows: 3,
        cols: 3,
        withHeaderRow: true,
      })
      .run();
  };

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      {/* TOOLBAR */}

      <div className="flex flex-wrap gap-1 border-b border-slate-200 bg-slate-50 p-2">
        <ToolbarButton
          title="Heading 2"
          active={editor.isActive(
            "heading",
            { level: 2 }
          )}
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleHeading({
                level: 2,
              })
              .run()
          }
        >
          <Heading2 size={17} />
        </ToolbarButton>

        <ToolbarButton
          title="Heading 3"
          active={editor.isActive(
            "heading",
            { level: 3 }
          )}
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleHeading({
                level: 3,
              })
              .run()
          }
        >
          <Heading3 size={17} />
        </ToolbarButton>

        <ToolbarButton
          title="Bold"
          active={editor.isActive(
            "bold"
          )}
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleBold()
              .run()
          }
        >
          <Bold size={17} />
        </ToolbarButton>

        <ToolbarButton
          title="Italic"
          active={editor.isActive(
            "italic"
          )}
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleItalic()
              .run()
          }
        >
          <Italic size={17} />
        </ToolbarButton>

        <ToolbarButton
          title="Bullet List"
          active={editor.isActive(
            "bulletList"
          )}
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleBulletList()
              .run()
          }
        >
          <List size={17} />
        </ToolbarButton>

        <ToolbarButton
          title="Numbered List"
          active={editor.isActive(
            "orderedList"
          )}
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleOrderedList()
              .run()
          }
        >
          <ListOrdered size={17} />
        </ToolbarButton>

        <ToolbarButton
          title="Insert Table"
          onClick={addTable}
        >
          <TableIcon size={17} />
        </ToolbarButton>

        <div className="mx-1 w-px bg-slate-200" />

        <ToolbarButton
          title="Undo"
          onClick={() =>
            editor
              .chain()
              .focus()
              .undo()
              .run()
          }
        >
          <Undo2 size={17} />
        </ToolbarButton>

        <ToolbarButton
          title="Redo"
          onClick={() =>
            editor
              .chain()
              .focus()
              .redo()
              .run()
          }
        >
          <Redo2 size={17} />
        </ToolbarButton>
      </div>

      <div className="relative">
        {!editor.getText() && (
          <div className="pointer-events-none absolute left-4 top-4 text-sm text-slate-400">
            {placeholder}
          </div>
        )}

        <EditorContent
          editor={editor}
        />
      </div>
    </div>
  );
}

function ToolbarButton({
  children,
  title,
  onClick,
  active = false,
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`flex h-9 w-9 items-center justify-center rounded-lg transition ${
        active
          ? "bg-karni-saffron-dark text-white"
          : "text-slate-600 hover:bg-slate-200"
      }`}
    >
      {children}
    </button>
  );
}