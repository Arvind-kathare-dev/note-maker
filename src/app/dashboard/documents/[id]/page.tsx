'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, Save, 
  Clock as ClockIcon, Tag,
  Printer, Check, FileText, 
  Layers, Info, BookOpen, User2, Calendar, Hash,
  X, ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useDocumentStore } from '@/store/useDocumentStore';
import TipTapEditor from '@/components/features/editor/TipTapEditor';
import ShareModal from '@/components/features/editor/ShareModal';
import { jsonToMarkdown } from '@/lib/converter';
import '@/components/features/editor/editor.css';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const STATUS_OPTIONS: Array<{ value: 'draft' | 'published' | 'archived'; label: string; color: string }> = [
  { value: 'draft',     label: 'Draft',     color: 'text-amber-500 bg-amber-500/10' },
  { value: 'published', label: 'Published', color: 'text-emerald-500 bg-emerald-500/10' },
  { value: 'archived',  label: 'Archived',  color: 'text-muted-foreground bg-accent' },
];

function InfoPanel({ doc, onClose, onUpdate }: {
  doc: any;
  onClose: () => void;
  onUpdate: (updates: any) => void;
}) {
  const statusMeta = STATUS_OPTIONS.find(s => s.value === doc.status) || STATUS_OPTIONS[0];

  return (
    <div className="w-72 shrink-0 border-r border-border bg-card/95 backdrop-blur-xl md:bg-card/50 flex flex-col h-full overflow-y-auto absolute md:relative z-50 inset-y-0 left-0 shadow-2xl md:shadow-none transition-all">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <span className="text-sm font-bold flex items-center gap-2">
          <Info className="w-4 h-4 text-primary" /> Document Info
        </span>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4 space-y-5 flex-1">
        {/* Status */}
        <div className="space-y-2">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Status</p>
          <div className="flex flex-wrap gap-1.5">
            {STATUS_OPTIONS.map(s => (
              <button
                key={s.value}
                onClick={() => onUpdate({ status: s.value })}
                className={cn(
                  'px-2.5 py-1 rounded-lg text-xs font-semibold transition-all border',
                  doc.status === s.value
                    ? `${s.color} border-current/20 ring-1 ring-current/30`
                    : 'text-muted-foreground bg-accent border-border hover:border-primary/30'
                )}
              >{s.label}</button>
            ))}
          </div>
        </div>

        {/* Category */}
        <div className="space-y-2">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Category</p>
          <div className="flex flex-wrap gap-1.5">
            {(['workflow', 'note', 'developer', 'client'] as const).map(cat => (
              <button
                key={cat}
                onClick={() => onUpdate({ category: cat })}
                className={cn(
                  'px-2.5 py-1 rounded-lg text-xs font-semibold capitalize transition-all border',
                  doc.category === cat
                    ? 'text-primary bg-primary/10 border-primary/30'
                    : 'text-muted-foreground bg-accent border-border hover:border-primary/30'
                )}
              >{cat}</button>
            ))}
          </div>
        </div>

        {/* Tags */}
        <div className="space-y-2">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <Tag className="w-3 h-3" /> Tags
          </p>
          <div className="flex flex-wrap gap-1.5">
            {doc.tags.map((tag: string) => (
              <span key={tag} className="flex items-center gap-1 px-2 py-0.5 bg-accent rounded-md text-[11px] font-medium text-muted-foreground group">
                #{tag}
                <button
                  onClick={() => onUpdate({ tags: doc.tags.filter((t: string) => t !== tag) })}
                  className="opacity-0 group-hover:opacity-100 transition-opacity hover:text-rose-500"
                ><X className="w-2.5 h-2.5" /></button>
              </span>
            ))}
            <TagInput onAdd={tag => onUpdate({ tags: [...doc.tags, tag] })} />
          </div>
        </div>

        {/* Emoji */}
        <div className="space-y-2">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Emoji</p>
          <div className="flex gap-1.5 flex-wrap">
            {['📄','📝','📘','🗒️','⚙️','💡','🎯','🔬','📊','🚀','🏗️','👥'].map(e => (
              <button
                key={e}
                onClick={() => onUpdate({ emoji: e })}
                className={cn(
                  'w-8 h-8 rounded-lg text-lg flex items-center justify-center transition-all',
                  doc.emoji === e ? 'bg-primary/20 ring-2 ring-primary' : 'hover:bg-accent'
                )}
              >{e}</button>
            ))}
          </div>
        </div>

        {/* Meta */}
        <div className="space-y-3 pt-2 border-t border-border">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Document Details</p>
          {[
            { icon: FileText, label: 'Word count', value: `${doc.wordCount} words` },
            { icon: Hash,     label: 'Version',    value: `v${doc.version}` },
            { icon: User2,    label: 'Author',     value: doc.authorName },
            { icon: Calendar, label: 'Created',    value: format(new Date(doc.createdAt), 'MMM d, yyyy') },
            { icon: Clock2,   label: 'Updated',    value: format(new Date(doc.updatedAt), 'MMM d, HH:mm') },
          ].map(row => {
            const Icon = row.icon;
            return (
              <div key={row.label} className="flex items-center gap-2.5">
                <Icon className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                <span className="text-xs text-muted-foreground flex-1">{row.label}</span>
                <span className="text-xs font-medium text-foreground">{row.value}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// mini component for adding a new tag inline
function TagInput({ onAdd }: { onAdd: (tag: string) => void }) {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState('');
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => { if (editing) ref.current?.focus(); }, [editing]);

  const commit = () => {
    const t = val.trim().toLowerCase().replace(/\s+/g, '-');
    if (t) onAdd(t);
    setVal('');
    setEditing(false);
  };

  if (!editing) return (
    <button onClick={() => setEditing(true)} className="px-2 py-0.5 rounded-md border border-dashed border-border text-[11px] text-muted-foreground hover:border-primary/50 hover:text-primary transition-all">
      + tag
    </button>
  );

  return (
    <input
      ref={ref}
      value={val}
      onChange={e => setVal(e.target.value)}
      onKeyDown={e => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') { setVal(''); setEditing(false); } }}
      onBlur={commit}
      placeholder="tag name"
      className="px-2 py-0.5 rounded-md border border-primary/50 bg-accent text-[11px] w-20 outline-none"
    />
  );
}

// alias for clarity
const Clock2 = ClockIcon;

export default function DocumentPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const { documents, updateDocument, setActiveDoc } = useDocumentStore();
  const [isHierarchyPreview, setIsHierarchyPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  const doc = documents.find(d => d.id === id);

  useEffect(() => {
    if (doc) setActiveDoc(doc.id);
  }, [doc, setActiveDoc]);

  if (!doc) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center h-full bg-background p-8">
        <div className="p-12 rounded-2xl bg-accent/20 border border-border flex flex-col items-center max-w-md text-center">
          <BookOpen className="w-12 h-12 text-muted-foreground mb-4" />
          <h2 className="text-xl font-bold mb-2">Document Not Found</h2>
          <p className="text-sm text-muted-foreground mb-6">This document might have been moved or deleted.</p>
          <Button onClick={() => router.push('/dashboard/documents')} className="rounded-lg px-6">Return Home</Button>
        </div>
      </div>
    );
  }

  const handleContentChange = (newContent: string) => {
    updateDocument(doc.id, { content: newContent });
    setSaved(false);
  };

  const handleSave = () => {
    updateDocument(doc.id, { version: doc.version + 1 });
    setSaving(true);
    setSaved(false);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }, 600);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    updateDocument(doc.id, { title: e.target.value });

  const getDocHierarchy = (parentId: string): any[] => {
    const children = documents.filter(d => d.parentId === parentId).sort((a, b) => a.title.localeCompare(b.title));
    return children.flatMap(child => [child, ...getDocHierarchy(child.id)]);
  };

  const handleDownloadPDF = () => {
    let bodyContent = '';
    try {
      const parsed = JSON.parse(doc.content);
      const toText = (node: any): string => {
        if (node.type === 'text') return node.text || '';
        if (node.content) return node.content.map(toText).join('');
        return '';
      };
      const toHtml = (node: any): string => {
        if (!node) return '';
        const inner = (node.content || []).map(toHtml).join('');
        switch (node.type) {
          case 'doc': return inner;
          case 'paragraph': return `<p>${inner || '&nbsp;'}</p>`;
          case 'heading': return `<h${node.attrs?.level || 1}>${inner}</h${node.attrs?.level || 1}>`;
          case 'bulletList': return `<ul>${inner}</ul>`;
          case 'orderedList': return `<ol>${inner}</ol>`;
          case 'listItem': return `<li>${inner}</li>`;
          case 'blockquote': return `<blockquote>${inner}</blockquote>`;
          case 'codeBlock': return `<pre><code>${toText(node)}</code></pre>`;
          case 'horizontalRule': return '<hr/>';
          case 'image':
            const src = node.attrs?.src || '';
            const alt = node.attrs?.alt || '';
            const title = node.attrs?.title || '';
            return `<img src="${src}" alt="${alt}" title="${title}" style="max-width: 100%; height: auto; display: block; margin: 12pt 0; border-radius: 4px;" />`;
          case 'table': return `<table style="width: 100%; border-collapse: collapse; margin: 12pt 0;">${inner}</table>`;
          case 'tableRow': return `<tr>${inner}</tr>`;
          case 'tableHeader': return `<th style="border: 1px solid #ccc; padding: 8pt; background: #f4f4f4; text-align: left;">${inner}</th>`;
          case 'tableCell': return `<td style="border: 1px solid #ccc; padding: 8pt;">${inner}</td>`;
          case 'text': {
            let t = node.text || '';
            (node.marks || []).forEach((m: any) => {
              if (m.type === 'bold') t = `<strong>${t}</strong>`;
              if (m.type === 'italic') t = `<em>${t}</em>`;
              if (m.type === 'underline') t = `<u>${t}</u>`;
              if (m.type === 'strike') t = `<s>${t}</s>`;
              if (m.type === 'code') t = `<code>${t}</code>`;
              if (m.type === 'link') t = `<a href="${m.attrs?.href || ''}" target="_blank" style="color: #3b82f6; text-decoration: underline;">${t}</a>`;
            });
            return t;
          }
          default: return inner;
        }
      };
      bodyContent = toHtml(parsed);
    } catch {
      bodyContent = `<p>${doc.content}</p>`;
    }

    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(`<!DOCTYPE html><html><head>
      <meta charset="utf-8">
      <title>${doc.title}</title>
      <style>
        @page { margin: 2cm; }
        body { font-family: Georgia, serif; font-size: 12pt; line-height: 1.8; color: #111; max-width: 720px; margin: 0 auto; padding: 20px; }
        h1 { font-size: 26pt; margin-bottom: 6pt; border-bottom: 2px solid #333; padding-bottom: 6pt; }
        h2 { font-size: 18pt; margin-top: 20pt; }
        h3 { font-size: 14pt; }
        p { margin: 8pt 0; }
        blockquote { border-left: 4px solid #888; margin: 12pt 0; padding: 8pt 16pt; color: #555; font-style: italic; }
        pre { background: #f4f4f4; padding: 12pt; border-radius: 4pt; font-family: monospace; font-size: 10pt; white-space: pre-wrap; }
        code { background: #f0f0f0; padding: 1pt 4pt; border-radius: 2pt; font-family: monospace; }
        ul, ol { padding-left: 24pt; margin: 8pt 0; }
        li { margin: 4pt 0; }
        hr { border: none; border-top: 1px solid #ccc; margin: 16pt 0; }
        strong { font-weight: bold; }
        .meta { font-size: 9pt; color: #888; margin-bottom: 24pt; border-bottom: 1px solid #eee; padding-bottom: 12pt; }
      </style>
    </head><body>
      <h1>${doc.title || 'Untitled'}</h1>
      <div class="meta">
        ${doc.authorName} &nbsp;·&nbsp; ${new Date(doc.updatedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })} &nbsp;·&nbsp; v${doc.version} &nbsp;·&nbsp; ${doc.wordCount} words
      </div>
      ${bodyContent}
      <script>
        window.onload = () => {
          setTimeout(() => {
            window.print();
          }, 100);
        };
      </script>
    </body></html>`);
    win.document.close();
  };

  const statusMeta = STATUS_OPTIONS.find(s => s.value === doc.status) || STATUS_OPTIONS[0];

  return (
    <div className="flex-1 w-full bg-background flex flex-col min-h-full">
      {/* Header */}
      <header className="h-14 border-b border-border bg-card sticky top-0 z-50 px-4 flex items-center gap-3">
        {/* Back */}
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="h-8 w-8 rounded-lg shrink-0">
          <ArrowLeft className="w-4 h-4" />
        </Button>

        {/* Doc icon + Title */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="text-xl shrink-0">{doc.emoji || '📄'}</span>
          <input
            value={doc.title}
            onChange={handleTitleChange}
            className="bg-transparent border-none focus:outline-none text-sm font-bold p-0 w-full min-w-0 truncate"
            placeholder="Untitled Document"
          />
        </div>

        {/* Meta pills */}
        <div className="hidden md:flex items-center gap-2 shrink-0">
          <span className={cn('text-[10px] font-bold uppercase px-2 py-0.5 rounded-md', statusMeta.color)}>
            {statusMeta.label}
          </span>
          <span className="text-[10px] text-muted-foreground font-medium flex items-center gap-1">
            <ClockIcon className="w-3 h-3" />
            {Math.ceil(doc.wordCount / 200) || 1} min read
          </span>
          <span className="text-[10px] text-muted-foreground font-medium">
            {doc.wordCount} words · v{doc.version}
          </span>
          {doc.tags.slice(0, 2).map(tag => (
            <Badge key={tag} variant="secondary" className="text-[9px] uppercase px-1.5 py-0 h-4">#{tag}</Badge>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Preview Toggle */}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsHierarchyPreview(!isHierarchyPreview)} 
            className={cn(
              "h-8 rounded-lg px-3 text-xs transition-colors", 
              isHierarchyPreview && "bg-primary text-primary-foreground border-primary hover:bg-primary/90 hover:text-primary-foreground"
            )}
          >
            {isHierarchyPreview ? 'Edit Document' : 'Preview'}
          </Button>

          {/* Info panel toggle */}
          <Button
            variant="ghost" size="icon"
            onClick={() => setShowInfo(!showInfo)}
            className={cn("h-8 w-8 rounded-lg", showInfo && "bg-primary/10 text-primary")}
          >
            <Info className="w-4 h-4" />
          </Button>

          {/* Download PDF */}
          <Button
            variant="outline" size="sm"
            onClick={handleDownloadPDF}
            className="h-8 rounded-lg gap-1.5 px-3 text-xs"
          >
            <Printer className="w-3.5 h-3.5" /> Download PDF
          </Button>

          {/* Save button */}
          <Button
            onClick={handleSave}
            size="sm"
            className={cn(
              "h-8 rounded-lg gap-1.5 px-3 text-xs transition-all",
              saved ? "bg-emerald-600 hover:bg-emerald-600 text-white" : ""
            )}
            disabled={saving}
          >
            {saved ? (
              <><Check className="w-3.5 h-3.5" /> Saved</>
            ) : saving ? (
              <><span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block" /> Saving…</>
            ) : (
              <><Save className="w-3.5 h-3.5" /> Save</>
            )}
          </Button>

          {/* Share */}
          <Button onClick={() => setIsShareModalOpen(true)} size="sm" className="h-8 rounded-lg px-3 text-xs">
            Share
          </Button>
        </div>
      </header>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden bg-background relative">
        {/* Info Panel */}
        {showInfo && (
          <InfoPanel
            doc={doc}
            onClose={() => setShowInfo(false)}
            onUpdate={(updates) => updateDocument(doc.id, updates)}
          />
        )}

        {/* Main Editor Container */}
        <div className="flex-1 overflow-y-auto relative w-full mx-auto py-10 px-8 md:px-12 lg:px-24 transition-all max-w-[1600px]">
          {isHierarchyPreview ? (
            <div className="space-y-16">
              {[doc, ...getDocHierarchy(doc.id)].map((hDoc) => (
                <div key={hDoc.id} className="border-l-2 border-primary/20 pl-8 relative">
                  <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-background border-2 border-primary" />
                  <h2 className="text-2xl font-bold mb-6">{hDoc.title}</h2>
                  <TipTapEditor content={hDoc.content} editable={false} />
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-background">
              <TipTapEditor content={doc.content} editable={true} onChange={handleContentChange} />
            </div>
          )}
        </div>
      </div>

      <ShareModal isOpen={isShareModalOpen} onClose={() => setIsShareModalOpen(false)} docTitle={doc.title} />
    </div>
  );
}
