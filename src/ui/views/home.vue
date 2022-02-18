<script lang="tsx">
import { BCMSTemplate } from '@becomes/cms-sdk/types';
import { BCMSStoreMutationTypes } from '@becomes/cms-ui/types';
import { defineComponent, onUnmounted, ref } from '@vue/runtime-core';

const component = defineComponent({
  setup() {
    const templates = ref<BCMSTemplate[]>(
      Object.assign([], window.bcms.vue.store.getters.template_items)
    );
    const bcmsStoreUnsub = window.bcms.vue.store.subscribe(
      (mutation, state) => {
        if (mutation.type === BCMSStoreMutationTypes.template_set) {
          templates.value = Object.assign({}, state.template);
        }
      }
    );

    onUnmounted(() => {
      bcmsStoreUnsub();
    });

    return () => (
      <>
        <pre>{JSON.stringify(templates.value, null, '  ')}</pre>
      </>
    );
  },
});
export default component;
</script>
