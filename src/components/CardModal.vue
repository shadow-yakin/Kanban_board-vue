<script setup>
import { ref, watch, nextTick } from 'vue'
import { useBoardStore } from '@/stores/board'

const props = defineProps({
  cardId: {
    type: String,
    default: null
  }
})

const emit = defineEmits(['close'])

const store = useBoardStore()

const draftTitle = ref('')
const draftDescription = ref('')
const titleInputRef = ref(null)

const card = () => store.cardById(props.cardId)

watch(
  () => props.cardId,
  async (id) => {
    if (!id) return
    const c = card()
    if (!c) return
    draftTitle.value = c.title
    draftDescription.value = c.description || ''
    await nextTick()
    titleInputRef.value?.focus()
  },
  { immediate: true }
)

function save() {
  const title = draftTitle.value.trim()
  if (!title) return
  store.updateCard(props.cardId, {
    title,
    description: draftDescription.value.trim()
  })
  emit('close')
}

function close() {
  emit('close')
}

function onOverlayClick(e) {
  if (e.target === e.currentTarget) close()
}

function onKeydown(e) {
  if (e.key === 'Escape') close()
  if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) save()
}
</script>

<template>
  <div
    v-if="cardId && card()"
    class="modal-overlay"
    @click="onOverlayClick"
    @keydown="onKeydown"
    tabindex="-1"
  >
    <div class="modal" role="dialog" aria-modal="true">
      <header class="modal__header">
        <h2 class="modal__heading">Карточка</h2>
        <button type="button" class="modal__close" @click="close">×</button>
      </header>

      <div class="modal__body">
        <label class="field">
          <span class="field__label">Заголовок</span>
          <input
            ref="titleInputRef"
            v-model="draftTitle"
            class="field__input"
            type="text"
            placeholder="Заголовок карточки"
          />
        </label>

        <label class="field">
          <span class="field__label">Описание</span>
          <textarea
            v-model="draftDescription"
            class="field__textarea"
            rows="6"
            placeholder="Добавьте более подробное описание…"
          />
        </label>

        <p v-if="card()?.createdAt" class="modal__meta">
          Создано: {{ new Date(card().createdAt).toLocaleString() }}
        </p>
      </div>

      <footer class="modal__footer">
        <button type="button" class="btn" @click="close">Отмена</button>
        <button type="button" class="btn btn--primary" @click="save">
          Сохранить
        </button>
      </footer>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: var(--bg-overlay);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 90;
  padding: 16px;
  box-sizing: border-box;
  backdrop-filter: blur(8px);
}

.modal {
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-xl);
  width: 100%;
  max-width: 520px;
  max-height: min(90vh, 760px);
  max-height: min(90dvh, 760px);
  display: flex;
  flex-direction: column;
  box-shadow: var(--shadow-modal);
}

.modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 22px;
  border-bottom: 1px solid var(--border-subtle);
}

.modal__heading {
  margin: 0;
  font-size: 17px;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.modal__close {
  border: none;
  background: transparent;
  font-size: 22px;
  line-height: 1;
  cursor: pointer;
  color: var(--text-muted);
  width: 34px;
  height: 34px;
  padding: 0;
  border-radius: var(--radius-sm);
  transition: color var(--transition-fast), background var(--transition-fast);
}

.modal__close:hover {
  color: var(--text-primary);
  background: var(--btn-bg-hover);
}

.modal__body {
  padding: 18px 22px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field__label {
  font-size: 13px;
  color: var(--text-secondary);
  font-weight: 500;
}

.field__input,
.field__textarea {
  width: 100%;
  box-sizing: border-box;
  border: 1px solid var(--border-input);
  border-radius: var(--radius-sm);
  padding: 10px 12px;
  font: inherit;
  background: var(--bg-input);
  color: var(--text-primary);
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
}

.field__input:focus,
.field__textarea:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: var(--accent-glow);
}

.field__textarea {
  resize: vertical;
  min-height: 100px;
}

.modal__meta {
  margin: 0;
  font-size: 12px;
  color: var(--text-muted);
}

.modal__footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 14px 22px;
  border-top: 1px solid var(--border-subtle);
}

.btn {
  border: 1px solid var(--border-subtle);
  background: var(--btn-bg);
  color: var(--text-primary);
  padding: 9px 14px;
  border-radius: var(--radius-sm);
  font-size: 14px;
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

@media (max-width: 480px) {
  .modal-overlay {
    align-items: flex-end;
    padding:
      max(10px, env(safe-area-inset-top))
      max(10px, env(safe-area-inset-right))
      max(10px, env(safe-area-inset-bottom))
      max(10px, env(safe-area-inset-left));
  }

  .modal {
    max-height: calc(100vh - 20px - env(safe-area-inset-top) - env(safe-area-inset-bottom));
    max-height: calc(100dvh - 20px - env(safe-area-inset-top) - env(safe-area-inset-bottom));
    border-radius: var(--radius-lg);
  }

  .modal__header,
  .modal__body,
  .modal__footer {
    padding-left: 16px;
    padding-right: 16px;
  }

  .modal__footer .btn {
    min-height: 44px;
    flex: 1 1 0;
  }
}

@media (max-width: 480px) and (max-height: 500px) {
  .modal-overlay {
    align-items: center;
  }
}
</style>