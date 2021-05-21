<style lang="scss">
.bcms--plugin-hello-world {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>

<script lang="tsx">
import { defineComponent } from 'vue';

const component = defineComponent({
  setup() {
    return () => <h1>Hello World</h1>;
  },
});
export default component;
</script>
