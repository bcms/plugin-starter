import { BCMSManagerNav } from '@becomes/cms-ui/components';
import { defineComponent, Teleport } from 'vue';
import { useRoute } from 'vue-router';

const component = defineComponent({
  setup(_props, ctx) {
    const route = useRoute();

    return () => (
      <div id={route.path}>
        <Teleport to="#plugin_nav">
          <BCMSManagerNav
            class="pluginNav"
            style="left: 0 !important;"
            label="bcms-plugin---name"
            items={[
              {
                name: 'Home',
                link: '/',
                selected: route.path === '/',
              },
              {
                name: 'Page 2',
                link: '/page-2',
                selected: route.path === '/page-2',
              },
            ]}
          />
        </Teleport>
        <div class="desktop:relative desktop:pl-[240px] lg:pl-[300px] px-5 desktop:py-15">
          {ctx.slots.default ? ctx.slots.default() : ''}
        </div>
      </div>
    );
  },
});
export default component;
