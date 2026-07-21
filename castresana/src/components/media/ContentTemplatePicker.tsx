import type { ContentTemplate } from "@/types/media";

/** Selector de plantilla de contenido (controlado por el StoryboardBuilder). */
export function ContentTemplatePicker({
  templates,
  selectedId,
  onSelect,
}: {
  templates: ContentTemplate[];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="pick-grid">
      {templates.map((t) => (
        <button key={t.id} type="button" className={`pick ${t.id === selectedId ? "on" : ""}`} onClick={() => onSelect(t.id)}>
          <b>{t.name}</b>
          <small>{t.description}</small>
          <small style={{ color: "var(--copper-soft)", marginTop: 5 }}>Tono: {t.tone}</small>
        </button>
      ))}
    </div>
  );
}
