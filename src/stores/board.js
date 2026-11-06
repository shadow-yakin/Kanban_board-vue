import { defineStore } from "pinia";
import { createSeedState } from "@/storage/seed";

let idCounter = 0;
function nextId(prefix) {
  idCounter += 1;
  return `${prefix}_${Date.now()}_${idCounter}`;
}

export const useBoardStore = defineStore("board", {
  state: () => createSeedState(),

  getters: {
    // Карточки конкретной колонки, отсортированные по position
    cardsByColumn: (state) => (columnId) =>
      state.cards
        .filter((c) => c.columnId === columnId)
        .sort((a, b) => a.position - b.position),

    // Колонки, отсортированные по position
    sortedColumns: (state) =>
      [...state.columns].sort((a, b) => a.position - b.position),

    columnById: (state) => (id) => state.columns.find((c) => c.id === id),

    cardById: (state) => (id) => state.cards.find((c) => c.id === id),
  },

  actions: {
    // ---------- Колонки ----------
    addColumn(title = "Новая колонка") {
      const position = this.columns.length;
      const column = { id: nextId("col"), title, position };
      this.columns.push(column);
      return column;
    },

    renameColumn(columnId, title) {
      const clean = (title || "").trim();
      if (!clean) return;
      const column = this.columns.find((c) => c.id === columnId);
      if (column) column.title = clean;
    },

    removeColumn(columnId) {
      this.columns = this.columns.filter((c) => c.id !== columnId);
      // каскадно удаляем карточки этой колонки
      this.cards = this.cards.filter((c) => c.columnId !== columnId);
    },

    // ---------- Карточки ----------
    addCard(columnId, title = "Новая задача") {
      const position = this.cards.filter((c) => c.columnId === columnId).length;
      const card = {
        id: nextId("card"),
        columnId,
        title,
        description: "",
        position,
        createdAt: Date.now(),
      };
      this.cards.push(card);
      return card;
    },

    updateCard(cardId, patch) {
      const card = this.cards.find((c) => c.id === cardId);
      if (!card) return;
      if (typeof patch.title === "string") {
        const clean = patch.title.trim();
        if (!clean) return;
        patch = { ...patch, title: clean };
      }
      Object.assign(card, patch);
    },

    removeCard(cardId) {
      this.cards = this.cards.filter((c) => c.id !== cardId);
    },

    moveCard(cardId, toColumnId, toIndex) {
      const card = this.cards.find((c) => c.id === cardId);
      if (!card) return;

      const fromColumnId = card.columnId;

      // Собираем карточки целевой колонки, исключая перемещаемую
      const targetCards = this.cards
        .filter((c) => c.columnId === toColumnId && c.id !== cardId)
        .sort((a, b) => a.position - b.position);

      // Ограничиваем индекс диапазоном
      const safeIndex = Math.max(0, Math.min(toIndex, targetCards.length));

      // Вставляем перемещаемую карточку в нужную позицию
      targetCards.splice(safeIndex, 0, card);

      // Пересчитываем position и columnId для целевой колонки
      targetCards.forEach((c, i) => {
        c.position = i;
        c.columnId = toColumnId;
      });

      // Если карточка ушла из другой колонки — пересчитываем и её
      if (fromColumnId !== toColumnId) {
        this.cards
          .filter((c) => c.columnId === fromColumnId && c.id !== cardId)
          .sort((a, b) => a.position - b.position)
          .forEach((c, i) => {
            c.position = i;
          });
      }
    },

    moveColumn(columnId, toIndex) {
      const column = this.columns.find((c) => c.id === columnId);
      if (!column) return;

      // Собираем колонки, исключая перемещаемую
      const ordered = this.columns
        .filter((c) => c.id !== columnId)
        .sort((a, b) => a.position - b.position);

      const safeIndex = Math.max(0, Math.min(toIndex, ordered.length));

      ordered.splice(safeIndex, 0, column);

      ordered.forEach((c, i) => {
        c.position = i;
      });
    },
  },
});
