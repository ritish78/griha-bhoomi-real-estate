"use client";

import { forwardRef, useEffect, useImperativeHandle, type AriaAttributes } from "react";
import { EditorContent, useEditor, useEditorState } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading2,
  List,
  ListOrdered,
  Undo2,
  Redo2,
  RemoveFormatting
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utlis";

interface RichTextEditorProps extends AriaAttributes {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  disabled?: boolean;
  className?: string;
}

export interface RichTextEditorHandle {
  focus: () => void;
}

export const RichTextEditor = forwardRef<RichTextEditorHandle, RichTextEditorProps>(
  function RichTextEditor(
    {
      id,
      value,
      onChange,
      onBlur,
      disabled = false,
      className,
      "aria-label": ariaLabel = "Text editor",
      "aria-describedby": ariaDescribedBy,
      "aria-invalid": ariaInvalid
    },
    ref
  ) {
    const editor = useEditor({
      //Next.js renders on the server, so we initialise the editor after hydration.
      immediatelyRender: false,
      shouldRerenderOnTransaction: false,

      extensions: [
        StarterKit.configure({
          heading: {
            levels: [2]
          },
          //We only enable the formatting needed by this editor.
          code: false,
          codeBlock: false,
          blockquote: false,
          horizontalRule: false,
          link: false
        })
      ],

      content: value || "",
      editable: !disabled,

      onUpdate: ({ editor }) => {
        //Empty formatting should not count as a description.
        const hasText = editor.getText().trim().length > 0;
        onChange(hasText ? editor.getHTML() : "");
      },

      onBlur: () => {
        onBlur?.();
      }
    });

    //We subscribe to formatting changes so the toolbar reflects the selection.
    const editorState = useEditorState({
      editor,
      selector: ({ editor }) => {
        if (!editor) {
          return null;
        }

        return {
          bold: editor.isActive("bold"),
          italic: editor.isActive("italic"),
          underline: editor.isActive("underline"),
          strike: editor.isActive("strike"),
          heading: editor.isActive("heading", { level: 2 }),
          bulletList: editor.isActive("bulletList"),
          orderedList: editor.isActive("orderedList"),
          canUndo: editor.can().undo(),
          canRedo: editor.can().redo()
        };
      }
    });

    //React Hook Form can focus the editor when description validation fails.
    useImperativeHandle(
      ref,
      () => ({
        focus: () => {
          editor?.commands.focus();
        }
      }),
      [editor]
    );

    //We update the content when saved values load or the parent resets the form.
    //We do not replace the document after every keystroke, which would move the cursor.
    useEffect(() => {
      if (!editor) {
        return;
      }

      const currentValue = editor.getText().trim().length > 0 ? editor.getHTML() : "";

      if (value !== currentValue) {
        editor.commands.setContent(value || "", {
          emitUpdate: false
        });
      }
    }, [editor, value]);

    useEffect(() => {
      if (editor) {
        editor.setEditable(!disabled, false);
      }
    }, [editor, disabled]);

    //FormControl's accessibility attributes belong on the editable element.
    useEffect(() => {
      if (!editor) {
        return;
      }

      editor.setOptions({
        editorProps: {
          attributes: {
            id: id ?? "",
            role: "textbox",
            "aria-label": ariaLabel,
            "aria-multiline": "true",
            "aria-describedby": ariaDescribedBy ?? "",
            "aria-invalid": String(ariaInvalid ?? false),
            "aria-disabled": String(disabled),
            class: [
              "min-h-[180px] max-h-[480px] overflow-y-auto",
              "break-words whitespace-pre-wrap px-3 py-3",
              "text-sm outline-none",
              "[&_p]:my-2",
              "[&_h2]:mb-2 [&_h2]:mt-4 [&_h2]:text-xl [&_h2]:font-semibold",
              "[&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-6",
              "[&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-6",
              "[&_li]:my-1 [&_li_p]:my-0"
            ].join(" ")
          }
        }
      });
    }, [editor, id, ariaLabel, ariaDescribedBy, ariaInvalid, disabled]);

    if (!editor) {
      return (
        <div
          aria-busy="true"
          aria-label="Loading text editor"
          className={cn("min-h-[230px] rounded-md border bg-background", className)}
        />
      );
    }

    const formattingButtons = [
      {
        label: "Bold",
        Icon: Bold,
        active: editorState?.bold,
        action: () => editor.chain().focus().toggleBold().run()
      },
      {
        label: "Italic",
        Icon: Italic,
        active: editorState?.italic,
        action: () => editor.chain().focus().toggleItalic().run()
      },
      {
        label: "Underline",
        Icon: Underline,
        active: editorState?.underline,
        action: () => editor.chain().focus().toggleUnderline().run()
      },
      {
        label: "Strikethrough",
        Icon: Strikethrough,
        active: editorState?.strike,
        action: () => editor.chain().focus().toggleStrike().run()
      },
      {
        label: "Heading",
        Icon: Heading2,
        active: editorState?.heading,
        action: () => editor.chain().focus().toggleHeading({ level: 2 }).run()
      },
      {
        label: "Bullet list",
        Icon: List,
        active: editorState?.bulletList,
        action: () => editor.chain().focus().toggleBulletList().run()
      },
      {
        label: "Numbered list",
        Icon: ListOrdered,
        active: editorState?.orderedList,
        action: () => editor.chain().focus().toggleOrderedList().run()
      }
    ];

    return (
      <div
        className={cn(
          "min-w-0 rounded-md border border-input bg-background",
          "focus-within:ring-1 focus-within:ring-ring",
          ariaInvalid && ariaInvalid !== "false" && "border-destructive",
          disabled && "opacity-50",
          className
        )}
      >
        <div
          role="group"
          aria-label="Text formatting"
          className="flex flex-wrap items-center gap-1 border-b p-2"
        >
          {formattingButtons.map(({ label, Icon, active, action }) => (
            <Button
              key={label}
              type="button"
              variant={active ? "secondary" : "ghost"}
              size="icon"
              title={label}
              aria-label={label}
              aria-pressed={!!active}
              disabled={disabled}
              onMouseDown={(event) => event.preventDefault()}
              onClick={action}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
            </Button>
          ))}

          <Button
            type="button"
            variant="ghost"
            size="icon"
            title="Clear formatting"
            aria-label="Clear formatting"
            disabled={disabled}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
          >
            <RemoveFormatting className="h-4 w-4" aria-hidden="true" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            title="Undo"
            aria-label="Undo"
            disabled={disabled || !editorState?.canUndo}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => editor.chain().focus().undo().run()}
          >
            <Undo2 className="h-4 w-4" aria-hidden="true" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            title="Redo"
            aria-label="Redo"
            disabled={disabled || !editorState?.canRedo}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => editor.chain().focus().redo().run()}
          >
            <Redo2 className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>

        <EditorContent editor={editor} />
      </div>
    );
  }
);
