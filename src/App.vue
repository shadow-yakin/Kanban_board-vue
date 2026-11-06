<script setup>
import BoardView from "@/components/BoardView.vue";
import ConfirmDialog from "@/components/ConfirmDialog.vue";
import { useTheme } from '@/composables/useTheme'

const { theme, toggle } = useTheme()
</script>

<template>
  <header class="app-header">
    <h1 class="app-heading">Канбан-доска</h1>

    <button
      class="theme-toggle"
      type="button"
      :title="theme === 'light' ? 'Тёмная тема' : 'Светлая тема'"
      :aria-label="theme === 'light' ? 'Включить тёмную тему' : 'Включить светлую тему'"
      @click="toggle"
    >
      {{ theme === 'light' ? '🌙' : '☀️' }}
    </button>
  </header>
  <BoardView />
  <ConfirmDialog />
</template>

<style>
html,
body,
#app {
  height: 100%;
  min-height: 100%;
  margin: 0;
  overscroll-behavior: none;
}

#app {
  height: 100vh;
  height: 100dvh;
  display: flex;
  flex-direction: column;
}

html {
  min-width: 320px;
  background: var(--bg-app);
}

body {
  min-width: 320px;
  overflow: hidden;
  background-color: var(--bg-app);
  background-image:
    linear-gradient(var(--bg-image-tint), var(--bg-image-tint)),
    var(--bg-image);
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  background-attachment: fixed;
  color: var(--text-primary);
  transition: background var(--transition-theme), color var(--transition-theme);
}

@media (max-width: 640px) {
  body {
    background-attachment: scroll;
  }
}

button,
input,
textarea {
  font: inherit;
}

.app-header {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 18px 24px 12px;
}

.app-heading {
  margin: 0 auto 12px;
  color: var(--text-primary);
  font-size: 32px;
  line-height: 1.2;
  letter-spacing: 1px;
}

.theme-toggle {
  display: grid;
  flex: 0 0 auto;
  place-items: center;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1px solid var(--border-strong);
  background: var(--bg-card);
  color: var(--text-primary);
  cursor: pointer;
  font-size: 18px;
  box-shadow: var(--shadow-control);
  transition: transform var(--transition-fast), border-color var(--transition-fast), box-shadow var(--transition-fast);
}

.theme-toggle:hover {
  transform: translateY(-2px);
  border-color: var(--accent);
  box-shadow: var(--shadow-control), var(--accent-glow);
}

.theme-toggle:active {
  transform: translateY(0) scale(0.96);
}

@media (max-width: 640px) {
  .app-header {
    padding:
      max(12px, env(safe-area-inset-top))
      max(14px, env(safe-area-inset-right))
      10px
      max(14px, env(safe-area-inset-left));
  }

  .app-heading {
    font-size: 18px;
  }

  .theme-toggle {
    width: 44px;
    height: 44px;
  }
}
</style>
