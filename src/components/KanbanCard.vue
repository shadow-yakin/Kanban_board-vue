<script setup>
import { useBoardStore } from '@/stores/board'
import { useConfirm } from '@/composables/useConfirm'

const props = defineProps({
  card: { type: Object, required: true }
})

const emit = defineEmits(['open'])

const store = useBoardStore()
const { confirm } = useConfirm()

async function remove() {
  const ok = await confirm(`Удалить карточку «${props.card.title}»?`)
  if (ok) store.removeCard(props.card.id)
}
</script>

<template>
  <div
    class="kanban-card"
    tabindex="0"
    @dblclick="emit('open', card.id)"
    @keydown.enter.prevent="emit('open', card.id)"
  >
    <span class="kanban-card__title">{{ card.title }}</span>
    <button
      class="kanban-card__remove"
      type="button"
      title="Удалить карточку"
      @click.stop="remove"
    >
      ×
    </button>
  </div>
</template>

<style scoped>
.kanban-card {
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  padding: 12px 12px 12px 14px;
  border-radius: var(--radius-md);
  margin-bottom: 10px;
  box-shadow: var(--shadow-card);
  cursor: pointer;
  word-break: break-word;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
  position: relative;
  transition: transform var(--transition-fast), box-shadow var(--transition-fast), border-color var(--transition-fast), background-color var(--transition-theme);
}

.kanban-card:hover {
  transform: translateY(-2px);
  border-color: color-mix(in srgb, var(--accent) 32%, var(--border-subtle));
  box-shadow: var(--shadow-card-hover);
}

.kanban-card:focus-visible {
  border-color: var(--accent);
  box-shadow: var(--shadow-card-hover), var(--accent-glow);
}

.kanban-card__title {
  flex: 1;
  min-width: 0;
}

.kanban-card__remove {
  border: none;
  background: transparent;
  color: var(--text-muted);
  flex: 0 0 28px;
  width: 28px;
  height: 28px;
  border-radius: var(--radius-sm);
  font-size: 19px;
  line-height: 1;
  padding: 0;
  cursor: pointer;
  opacity: 0;
  transition: opacity var(--transition-fast), color var(--transition-fast), background-color var(--transition-fast);
}

.kanban-card:hover .kanban-card__remove,
.kanban-card:focus-within .kanban-card__remove {
  opacity: 1;
}

.kanban-card__remove:hover {
  color: var(--danger);
  background: var(--accent-soft);
}

@media (hover: none) {
  .kanban-card__remove {
    opacity: 1;
    width: 40px;
    height: 40px;
    flex-basis: 40px;
  }
}
</style>