import { defineComponent, ref } from 'vue';
import { RouterView } from 'vue-router';
import { Layout } from './layout';

const component = defineComponent({
  setup() {
    const theme = ref(window.bcms.sdk.storage.get('theme'));
    window.bcms.sdk.storage.subscribe('theme', (value) => {
      theme.value = value;
    });

    return () => (
      <>
        <div id="plugin_nav" class={theme.value} />
        <div class={theme.value}>
          <Layout>
            <RouterView />
          </Layout>
        </div>
      </>
    );
  },
});
export default component;
