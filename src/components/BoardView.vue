<script setup>
import { ref, computed } from 'vue'
import { VueDraggable } from 'vue-draggable-plus'
import { useBoardStore } from '@/stores/board'
import BoardColumn from './BoardColumn.vue'
import AddColumnForm from './AddColumnForm.vue'
import CardModal from './CardModal.vue'

const store = useBoardStore()

const columns = computed({
  get: () => store.sortedColumns,
  set: () => {}
})

const openedCardId = ref(null)

function onColumnDragEnd(event) {
  const columnId = event.item.dataset.columnId
  if (!columnId) return
  store.moveColumn(columnId, event.newIndex)
}

function openCard(cardId) {
  openedCardId.value = cardId
}

function closeCard() {
  openedCardId.value = null
}
</script>

<template>
  <div class="board-view">
    <p v-if="columns.length === 0" class="board-view__empty">
      На доске пока нет колонок. Добавьте первую, чтобы начать.
    </p>

    <VueDraggable
      v-model="columns"
      :animation="150"
      ghost-class="ghost"
      class="board-view__columns"
      @end="onColumnDragEnd"
    >
      <BoardColumn
        v-for="column in columns"
        :key="column.id"
        :column="column"
        :data-column-id="column.id"
        @open-card="openCard"
      />
    </VueDraggable>

    <AddColumnForm />

    <CardModal :card-id="openedCardId" @close="closeCard" />
  </div>
</template>

<style scoped>
.board-view {
  flex: 1 1 0;
  height: auto;
  width: 100%;
  min-width: 0;
  min-height: 0;
  overflow-x: auto;
  overflow-y: hidden;
  padding: 24px;
  box-sizing: border-box;
  display: flex;
  gap: 18px;
  align-items: flex-start;
  background:
    radial-gradient(ellipse at 12% -18%, var(--ambient-a), transparent 42%),
    radial-gradient(ellipse at 88% 0%, var(--ambient-b), transparent 36%),
    transparent;
  transition: background-color var(--transition-theme);
}

.board-view__columns {
  display: flex;
  flex: 0 0 auto;
  gap: 18px;
  align-items: flex-start;
  height: 100%;
}

.board-view__empty {
  margin: 0;
  padding: 24px 28px;
  background: var(--bg-column);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-column);
  color: var(--text-secondary);
  font-size: 14px;
  align-self: flex-start;
  line-height: 1.6;
}

@media (max-width: 640px) {
  .board-view {
    padding:
      10px
      max(14px, env(safe-area-inset-right))
      max(16px, env(safe-area-inset-bottom))
      max(14px, env(safe-area-inset-left));
    gap: 14px;
  }

  .board-view__columns {
    gap: 14px;
  }
}

@media (max-width: 640px) and (max-height: 500px) {
  .board-view {
    padding-top: 8px;
  }
}
</style>