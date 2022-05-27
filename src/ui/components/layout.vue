<script lang="tsx">
import { defineComponent, PropType } from '@vue/runtime-core';
import { RouterLink } from 'vue-router';
import { LayoutSideNavItem } from '../types';

const component = defineComponent({
  props: {
    sideNavItems: Array as PropType<LayoutSideNavItem[]>,
  },
  setup(props, ctx) {
    const route = window.bcms.vue.router.currentRoute;

    return () => (
      <div class={`layout${props.sideNavItems ? ' layout--2col' : ''}`}>
        {props.sideNavItems ? (
          <div class="layout--sideNav">
            {props.sideNavItems.map((item) => {
              return (
                <RouterLink to={`${route.value.path}${item.hash}`}>
                  {item.name}
                </RouterLink>
              );
            })}
          </div>
        ) : (
          ''
        )}
        <div class="layout--content">
          {ctx.slots.default ? ctx.slots.default() : ''}
        </div>
      </div>
    );
  },
});
export default component;
</script>
