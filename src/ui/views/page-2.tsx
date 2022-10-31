import { defineComponent } from 'vue';

const component = defineComponent({
  setup() {
    return () => <h1 class="dark:text-white">This is page 2.</h1>;
  },
});
export default component;
