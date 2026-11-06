<script setup>
import { ref } from 'vue'
import { useBoardStore } from '@/stores/board'

const store = useBoardStore()

const isAdding = ref(false)
const title = ref('')
const inputRef = ref(null)

function startAdding() {
  isAdding.value = true
  title.value = ''
  requestAnimationFrame(() => inputRef.value?.focus())
}

function submit() {
  const value = title.value.trim()
  if (!value) {
    cancel()
    return
  }
  store.addColumn(value)
  cancel()
}

function cancel() {
  isAdding.value = false
  title.value = ''
}
</script>

<template>
  <div class="add-column">
    <form v-if="isAdding" @submit.prevent="submit" class="add-column__form">
      <input
        ref="inputRef"
        v-model="title"
        class="add-column__input"
        placeholder="Название колонки"
        @keydown.esc="cancel"
      />
      <div class="add-column__actions">
        <button type="submit" class="btn btn--primary">Добавить</button>
        <button type="button" class="btn" @click="cancel">Отмена</button>
      </div>
    </form>

    <button v-else class="add-column__btn" @click="startAdding">
      + Добавить колонку
    </button>
  </div>
</template>

<style scoped>
.add-column {
  width: 296px;
  flex: 0 0 auto;
}

.add-column__form {
  background: var(--bg-column);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  padding: 14px;
  box-shadow: var(--shadow-column);
}

.add-column__input {
  width: 100%;
  box-sizing: border-box;
  border: 1px solid var(--border-input);
  border-radius: var(--radius-sm);
  padding: 9px 10px;
  font: inherit;
  background: var(--bg-input);
  color: var(--text-primary);
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
}

.add-column__input:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: var(--accent-glow);
}

.add-column__actions {
  display: flex;
  gap: 8px;
  margin-top: 9px;
}

.add-column__btn {
  width: 100%;
  background: var(--bg-column);
  border: 1px dashed var(--border-strong);
  border-radius: var(--radius-lg);
  min-height: 52px;
  padding: 15px;
  text-align: left;
  color: var(--text-secondary);
  font-size: 14px;
  cursor: pointer;
  box-shadow: var(--shadow-column);
  transition: color var(--transition-fast), background var(--transition-fast), border-color var(--transition-fast), transform var(--transition-fast), box-shadow var(--transition-fast);
}

.add-column__btn:hover {
  background: var(--accent-soft);
  color: var(--text-primary);
  border-color: var(--accent);
  transform: translateY(-2px);
  box-shadow: var(--shadow-column), var(--accent-glow);
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

@media (max-width: 640px) {
  .add-column {
    width: min(296px, calc(100vw - 28px - env(safe-area-inset-left) - env(safe-area-inset-right)));
  }

  .add-column__actions .btn {
    min-height: 44px;
  }
}
</style>