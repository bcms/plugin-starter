<script lang="tsx">
import { defineComponent } from 'vue';
import { RouterView } from 'vue-router';
import { Layout } from './layout';

const component = defineComponent({
  setup() {
    return () => (
      <>
        <div id="plugin_nav" />
        <Layout>
          <RouterView />
        </Layout>
      </>
    );
  },
});
export default component;
</script>
