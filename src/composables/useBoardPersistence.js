import { watch } from 'vue'
import { useBoardStore } from '../stores/board'
import { load, save } from '../storage/boardStorage'

export function useBoardPersistence() {
  const store = useBoardStore()

  const saved = load()
  if (saved) {
    store.columns = saved.columns
    store.cards = saved.cards
  }

  let timer = null
  watch(
    () => ({ columns: store.columns, cards: store.cards }),
    (state) => {
      clearTimeout(timer)
      timer = setTimeout(() => {
        save({ version: 1, ...state })
      }, 250)
    },
    { deep: true, immediate: true }
  )
}