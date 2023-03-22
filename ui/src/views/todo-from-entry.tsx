import { BCMSEntry, BCMSPropType } from '@becomes/cms-sdk/types';
import { computed, defineComponent, onMounted, ref } from 'vue';

export default defineComponent({
  setup() {
    const todoEntries = ref<BCMSEntry[]>([]);
    const todos = computed(() => {
      return todoEntries.value.map((entry) => {
        return {
          _id: entry._id,
          description:
            entry.meta[0].props.find((e) => (e.data as string[])[0]) || '',
          done:
            entry.meta[0].props.find((e) => (e.data as boolean[])[0]) || false,
        };
      });
    });

    onMounted(async () => {
      await window.bcms.util.throwable(
        async () => {
          const templates = await window.bcms.sdk.template.getAll();
          let todoTemplate = await templates.find((e) => e.name === 'todo');
          if (!todoTemplate) {
            todoTemplate = await window.bcms.sdk.template.create({
              desc: '',
              label: 'Todo',
              singleEntry: false,
            });
          } else {
            let shouldUpdate = false;
            const descriptionProp = todoTemplate.props.find(
              (e) => e.id === 'description'
            );
            if (!descriptionProp) {
              shouldUpdate = true;
              todoTemplate.props.push({
                array: false,
                defaultData: [''],
                id: 'description',
                label: 'Description',
                name: 'description',
                required: true,
                type: BCMSPropType.STRING,
              });
            }
            const doneProp = todoTemplate.props.find((e) => e.id === 'done');
            if (!doneProp) {
              shouldUpdate = true;
              todoTemplate.props.push({
                array: false,
                defaultData: [''],
                id: 'done',
                label: 'Done',
                name: 'done',
                required: true,
                type: BCMSPropType.BOOLEAN,
              });
            }
            if (shouldUpdate) {
              todoTemplate = await window.bcms.sdk.template.update(
                todoTemplate
              );
            }
          }
          return await window.bcms.sdk.entry.getAllByTemplateId({
            templateId: todoTemplate._id,
          });
        },
        async (result) => {
          console.log(result);
          todoEntries.value = [];
        }
      );
    });

    return () => (
      <div class="dark:text-white grid grid-cols-2 gap-10">
        <pre>{JSON.stringify(todos.value, null, '  ')}</pre>
      </div>
    );
  },
});
