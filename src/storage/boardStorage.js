const KEY = "kanban-board-v1";
const CURRENT_VERSION = 1;

export function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const state = JSON.parse(raw);
    return migrate(state);
  } catch (e) {
    console.warn("Не удалось прочитать доску из localStorage", e);
    return null;
  }
}

export function save(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch (e) {
    console.warn("Не удалось сохранить доску в localStorage", e);
  }
}

function migrate(state) {
  if (!state || typeof state !== "object") return null;

  if (state.version === 1) {
    state.cards = (state.cards || []).map((card) => ({
      ...card,
      description: card.description ?? "",
      createdAt: card.createdAt ?? Date.now(),
    }));
    state.version = 2;
  }

  if (state.version !== CURRENT_VERSION) {
    state.version = CURRENT_VERSION;
  }

  return state;
}
