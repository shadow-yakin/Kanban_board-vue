import { reactive } from "vue";

const state = reactive({
  visible: false,
  message: "",
  resolve: null,
});

export function useConfirm() {
  function confirm(message) {
    return new Promise((resolve) => {
      state.message = message;
      state.visible = true;
      state.resolve = resolve;
    });
  }

  function answer(value) {
    state.visible = false;
    const r = state.resolve;
    state.resolve = null;
    r?.(value);
  }

  return { state, confirm, answer };
}
