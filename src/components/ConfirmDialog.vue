<script setup>
import { ref, watch, nextTick } from 'vue'
import { useConfirm } from '@/composables/useConfirm'

const { state, answer } = useConfirm()
const cancelBtnRef = ref(null)

watch(
  () => state.visible,
  async (visible) => {
    if (visible) {
      await nextTick()
      cancelBtnRef.value?.focus()
    }
  }
)

function onKeydown(e) {
  if (e.key === 'Escape') answer(false)
}
</script>

<template>
   <div
    v-if="state.visible"
    class="confirm-overlay"
    @click.self="answer(false)"
    @keydown="onKeydown"
    tabindex="-1"
  >
    <div class="confirm-dialog" role="dialog" aria-modal="true">
      <p class="confirm-dialog__message">{{ state.message }}</p>
      <div class="confirm-dialog__actions">
        <button
          ref="cancelBtnRef"
          type="button"
          class="btn"
          @click="answer(false)"
        >
          Отмена
        </button>
        <button type="button" class="btn btn--danger" @click="answer(true)">
          Удалить
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.confirm-overlay {
  position: fixed;
  inset: 0;
  background: var(--bg-overlay);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 16px;
  padding:
    max(16px, env(safe-area-inset-top))
    max(16px, env(safe-area-inset-right))
    max(16px, env(safe-area-inset-bottom))
    max(16px, env(safe-area-inset-left));
  backdrop-filter: blur(8px);
}

.confirm-dialog {
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-xl);
  padding: 24px;
  max-width: 360px;
  width: 100%;
  max-height: calc(100vh - 32px);
  max-height: calc(100dvh - 32px);
  overflow-y: auto;
  box-shadow: var(--shadow-modal);
}

.confirm-dialog__message {
  margin: 0 0 16px;
  font-size: 15px;
  line-height: 1.4;
  word-break: break-word;
}

.confirm-dialog__actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
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

.btn--danger {
  background: var(--danger);
  border-color: transparent;
  color: #ffffff;
}

.btn--danger:hover {
  background: var(--danger-hover);
  border-color: transparent;
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--danger) 20%, transparent);
}

.btn:active {
  transform: translateY(0) scale(0.98);
}

@media (max-width: 480px) {
  .confirm-overlay {
    align-items: flex-end;
  }

  .confirm-dialog {
    padding: 20px;
  }

  .confirm-dialog__actions .btn {
    min-height: 44px;
  }
}
</style>