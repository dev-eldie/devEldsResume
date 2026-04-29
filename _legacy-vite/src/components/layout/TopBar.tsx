import { useState, useRef, useEffect } from "react";
import { Save, Copy, FileDown, GitCompare } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useLineStore } from "@/store/useLineStore";

export function TopBar() {
  const projectName = useLineStore((s) => s.projectName);
  const setProjectName = useLineStore((s) => s.setProjectName);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(projectName);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) inputRef.current?.select();
  }, [editing]);

  const commit = () => {
    setProjectName(draft.trim() || projectName);
    setEditing(false);
  };

  return (
    <header className="flex h-16 items-center justify-between gap-4 border-b border-border bg-surface px-6">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex flex-col min-w-0">
          <span className="text-[11px] font-medium uppercase tracking-wider text-text-muted">
            Project
          </span>
          {editing ? (
            <input
              ref={inputRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onBlur={commit}
              onKeyDown={(e) => {
                if (e.key === "Enter") commit();
                if (e.key === "Escape") {
                  setDraft(projectName);
                  setEditing(false);
                }
              }}
              className="font-display text-base font-semibold text-text bg-transparent border-b border-primary focus:outline-none min-w-0"
              aria-label="Project name"
            />
          ) : (
            <button
              type="button"
              onClick={() => {
                setDraft(projectName);
                setEditing(true);
              }}
              className="font-display text-base font-semibold text-text text-left cursor-pointer hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm truncate"
            >
              {projectName}
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm">
          <Copy className="h-4 w-4" /> Duplicate
        </Button>
        <Button variant="secondary" size="sm">
          <GitCompare className="h-4 w-4" /> Compare
        </Button>
        <Button variant="secondary" size="sm">
          <FileDown className="h-4 w-4" /> Export PDF
        </Button>
        <Button variant="primary" size="sm">
          <Save className="h-4 w-4" /> Save
        </Button>
      </div>
    </header>
  );
}
