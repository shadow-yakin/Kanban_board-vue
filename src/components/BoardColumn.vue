<script setup>
import { ref, computed, nextTick } from 'vue'
import { VueDraggable } from 'vue-draggable-plus'
import { useBoardStore } from '@/stores/board'
import { useConfirm } from '@/composables/useConfirm'
import KanbanCard from './KanbanCard.vue'

const props = defineProps({
  column: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['open-card'])

const store = useBoardStore()
const { confirm } = useConfirm()

const cards = computed({
  get: () => store.cardsByColumn(props.column.id),
  set: () => {}
})

const isAdding = ref(false)
const newCardTitle = ref('')
const inputRef = ref(null)

const isEditingTitle = ref(false)
const draftTitle = ref('')
const titleInputRef = ref(null)

function startEditingTitle() {
  isEditingTitle.value = true
  draftTitle.value = props.column.title
  nextTick(() => {
    titleInputRef.value?.focus()
    titleInputRef.value?.select()
  })
}

function submitTitle() {
  const title = draftTitle.value.trim()
  if (title && title !== props.column.title) {
    store.renameColumn(props.column.id, title)
  }
  isEditingTitle.value = false
}

function cancelTitleEdit() {
  isEditingTitle.value = false
  draftTitle.value = ''
}

async function removeColumn() {
  const count = cards.value.length
  const message =
    count > 0
      ? `Удалить колонку «${props.column.title}» и ${count} карточек в ней?`
      : `Удалить колонку «${props.column.title}»?`
  const ok = await confirm(message)
  if (ok) store.removeColumn(props.column.id)
}

function startAdding() {
  isAdding.value = true
  newCardTitle.value = ''
  requestAnimationFrame(() => inputRef.value?.focus())
}

function submitCard() {
  const title = newCardTitle.value.trim()
  if (!title) {
    cancelAdding()
    return
  }
  store.addCard(props.column.id, title)
  newCardTitle.value = ''
  requestAnimationFrame(() => inputRef.value?.focus())
}

function cancelAdding() {
  isAdding.value = false
  newCardTitle.value = ''
}

function onDragEnd(event) {
  const cardId = event.item.dataset.cardId
  const toColumnId = event.to.dataset.columnId

  if (!cardId || !toColumnId) return

  store.moveCard(cardId, toColumnId, event.newIndex)
}

function onCardOpen(cardId) {
  emit('open-card', cardId)
}
</script>

<template>
  <section class="board-column">
    <header class="board-column__header">
      <template v-if="isEditingTitle">
        <input
          ref="titleInputRef"
          v-model="draftTitle"
          class="board-column__title-input"
          @keydown.enter.prevent="submitTitle"
          @keydown.esc="cancelTitleEdit"
          @blur="submitTitle"
        />
      </template>

      <template v-else>
        <h3 class="board-column__title" @dblclick="startEditingTitle">
          {{ column.title }}
        </h3>
        <span class="board-column__count">{{ cards.length }}</span>
        <button
          class="board-column__remove"
          type="button"
          title="Удалить колонку"
          @click.stop="removeColumn"
        >
          ×
        </button>
      </template>
    </header>

    <VueDraggable
      v-model="cards"
      group="cards"
      :animation="150"
      ghost-class="ghost"
      class="board-column__cards"
      :data-column-id="column.id"
      @end="onDragEnd"
    >
      <KanbanCard
        v-for="card in cards"
        :key="card.id"
        :card="card"
        :data-card-id="card.id"
        @open="onCardOpen"
      />
    </VueDraggable>

    <p v-if="cards.length === 0 && !isAdding" class="board-column__empty">
      Нет карточек
    </p>

    <div class="board-column__footer">
      <form v-if="isAdding" @submit.prevent="submitCard" class="add-card-form">
        <textarea
          ref="inputRef"
          v-model="newCardTitle"
          class="add-card-form__input"
          placeholder="Введите заголовок карточки…"
          rows="2"
          @keydown.enter.exact.prevent="submitCard"
          @keydown.esc="cancelAdding"
        />
        <div class="add-card-form__actions">
          <button type="submit" class="btn btn--primary">Добавить</button>
          <button type="button" class="btn" @click="cancelAdding">
            Отмена
          </button>
        </div>
      </form>

      <button v-else class="add-card-btn" @click="startAdding">
        + Добавить карточку
      </button>
    </div>
  </section>
</template>

<style scoped>
.board-column {
  background: var(--bg-column);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  padding: 14px;
  width: 296px;
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
  max-height: 100%;
  min-height: 0;
  position: relative;
  box-shadow: var(--shadow-column);
  backdrop-filter: blur(14px);
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast), background-color var(--transition-theme);
}

.board-column::before {
  content: '';
  position: absolute;
  top: -1px;
  left: 20px;
  right: 20px;
  height: 2px;
  border-radius: 0 0 2px 2px;
  background: linear-gradient(90deg, transparent, var(--accent-bright), transparent);
  opacity: 0.58;
}

.board-column__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
  gap: 8px;
  min-height: 34px;
}

.board-column__title {
  margin: 0;
  font-size: 15px;
  font-weight: 700;
  letter-spacing: -0.015em;
  flex: 1;
  min-width: 0;
  cursor: text;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.board-column__title:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
  border-radius: var(--radius-sm);
}

.board-column__title-input {
  flex: 1;
  min-width: 0;
  border: 1px solid var(--accent);
  border-radius: var(--radius-sm);
  padding: 6px 8px;
  font: inherit;
  font-size: 15px;
  font-weight: 600;
}

.board-column__title-input:focus {
  outline: none;
}

.board-column__remove {
  border: none;
  background: transparent;
  color: var(--text-muted);
  font-size: 18px;
  line-height: 1;
  padding: 0 2px;
  cursor: pointer;
  opacity: 0;
  width: 30px;
  height: 30px;
  border-radius: var(--radius-sm);
  transition: opacity var(--transition-fast), color var(--transition-fast), background var(--transition-fast);
}

.board-column:hover .board-column__remove,
.board-column:focus-within .board-column__remove {
  opacity: 1;
}

.board-column__remove:hover {
  color: var(--danger);
  background: var(--accent-soft);
}

.board-column__count {
  background: var(--badge-bg);
  border: 1px solid color-mix(in srgb, var(--accent) 16%, transparent);
  border-radius: 999px;
  min-width: 28px;
  padding: 3px 8px;
  font-size: 12px;
  color: var(--badge-text);
  font-weight: 700;
  text-align: center;
}

.board-column__cards {
  overflow-y: auto;
  min-height: 0;
  overscroll-behavior: contain;
  flex: 1 1 auto;
  padding: 2px 3px 4px 1px;
  scrollbar-color: var(--border-strong) transparent;
  scrollbar-width: thin;
}

.board-column__empty {
  margin: 0;
  color: var(--text-muted);
  font-size: 13px;
  text-align: center;
  padding: 14px 8px;
  border: 1px dashed var(--border-strong);
  border-radius: var(--radius-md);
  line-height: 1.5;
}

.board-column__footer {
  margin-top: 10px;
  padding-top: 8px;
  border-top: 1px solid var(--border-subtle);
}

.add-card-btn {
  width: 100%;
  background: transparent;
  border: none;
  text-align: left;
  padding: 9px 10px;
  border-radius: var(--radius-sm);
  color: var(--text-secondary);
  font-size: 14px;
  cursor: pointer;
  text-align: left;
  transition: color var(--transition-fast), background var(--transition-fast), box-shadow var(--transition-fast);
}

.add-card-btn:hover {
  background: var(--accent-soft);
  color: var(--text-primary);
}

.add-card-form__input {
  width: 100%;
  box-sizing: border-box;
  border: 1px solid var(--border-input);
  border-radius: var(--radius-sm);
  padding: 9px 10px;
  font: inherit;
  resize: vertical;
  min-height: 60px;
  background: var(--bg-input);
  color: var(--text-primary);
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
}

.add-card-form__input:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: var(--accent-glow);
}

.add-card-form__actions {
  display: flex;
  gap: 8px;
  margin-top: 9px;
}

.btn {
  border: none;
  background: var(--btn-bg);
  color: var(--text-primary);
  padding: 8px 12px;
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-sm);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: transform var(--transition-fast), background var(--transition-fast), border-color var(--transition-fast), box-shadow var(--transition-fast);
}

.btn:hover {
  background: var(--btn-bg-hover);
  border-color: var(--border-strong);
  transform: translateY(-1px);
}

.btn--primary {
  background: var(--accent);
  border-color: transparent;
  color: var(--accent-contrast);
  box-shadow: 0 4px 12px color-mix(in srgb, var(--accent) 28%, transparent);
}

.btn--primary:hover {
  background: var(--accent-hover);
  border-color: transparent;
  box-shadow: var(--accent-glow);
}

.btn:active {
  transform: translateY(0) scale(0.98);
}

@media (hover: none) {
  .board-column__remove {
    opacity: 1;
  }
}

@media (max-width: 640px) {
  .board-column {
    width: min(296px, calc(100vw - 28px - env(safe-area-inset-left) - env(safe-area-inset-right)));
    padding: 12px;
  }

  .board-column__remove {
    width: 40px;
    height: 40px;
  }

  .add-card-btn,
  .board-column .btn {
    min-height: 44px;
  }
}

@media (hover: none) and (max-width: 640px) {
  .board-column__remove {
    opacity: 1;
  }
}
</style>