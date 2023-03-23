import type { Todo } from '@backend/todo';
import {
  BCMSEntry,
  BCMSPropType,
  BCMSTemplate,
  BCMSTemplateUpdateData,
} from '@becomes/cms-sdk/types';
import {
  TodoAddEditModalOutputData,
  TodoItem,
  TodoItems,
} from '@ui/components';
import { computed, defineComponent, onMounted, ref } from 'vue';

export default defineComponent({
  setup() {
    const template = ref<BCMSTemplate | null>();
    const propIds = computed(() => {
      let titlePropId = '';
      let slugPropId = '';
      let descPropId = '';
      let donePropId = '';
      if (template.value) {
        for (let i = 0; i < template.value.props.length; i++) {
          const prop = template.value.props[i];
          if (prop.name === 'title') {
            titlePropId = prop.id;
          } else if (prop.name === 'slug') {
            slugPropId = prop.id;
          } else if (prop.name === 'description') {
            descPropId = prop.id;
          } else if (prop.name === 'done') {
            donePropId = prop.id;
          }
        }
      }
      return {
        titlePropId,
        slugPropId,
        descPropId,
        donePropId,
      };
    });
    const todoEntries = ref<BCMSEntry[]>([]);
    const todos = computed<Todo[]>(() => {
      return todoEntries.value
        .map((entry) => {
          const item: Todo = {
            _id: entry._id,
            createdAt: entry.createdAt,
            updatedAt: entry.updatedAt,
            description:
              (
                entry.meta[0].props.find(
                  (e) => e.id === propIds.value.descPropId
                )?.data as string[]
              )[0] || '',
            done:
              (
                entry.meta[0].props.find(
                  (e) => e.id === propIds.value.donePropId
                )?.data as boolean[]
              )[0] || false,
          };
          return item;
        })
        .sort((a, b) => b.createdAt - a.createdAt);
    });

    onMounted(async () => {
      await window.bcms.util.throwable(
        async () => {
          const templates = await window.bcms.sdk.template.getAll();
          let todoTemplate = templates.find((e) => e.name === 'todo');
          if (!todoTemplate) {
            todoTemplate = await window.bcms.sdk.template.create({
              desc: '',
              label: 'Todo',
              singleEntry: false,
            });
          }
          let shouldUpdate = false;
          const updateInfo: BCMSTemplateUpdateData = {
            _id: todoTemplate._id,
            propChanges: [],
          };
          const descriptionProp = todoTemplate.props.find(
            (e) => e.name === 'description'
          );
          if (!descriptionProp) {
            shouldUpdate = true;
            updateInfo.propChanges?.push({
              add: {
                array: false,
                defaultData: [''],
                label: 'Description',
                required: true,
                type: BCMSPropType.STRING,
              },
            });
          }
          const doneProp = todoTemplate.props.find((e) => e.name === 'done');
          if (!doneProp) {
            shouldUpdate = true;
            updateInfo.propChanges?.push({
              add: {
                array: false,
                defaultData: [''],
                label: 'Done',
                required: true,
                type: BCMSPropType.BOOLEAN,
              },
            });
          }
          if (shouldUpdate) {
            todoTemplate = await window.bcms.sdk.template.update(updateInfo);
          }
          template.value = todoTemplate;

          return await window.bcms.sdk.entry.getAllByTemplateId({
            templateId: todoTemplate._id,
          });
        },
        async (result) => {
          todoEntries.value = result;
        }
      );
    });

    async function addTodo(data: TodoAddEditModalOutputData) {
      await window.bcms.util.throwable(
        async () => {
          return await window.bcms.sdk.entry.create({
            templateId: template.value?._id || '',
            meta: [
              {
                lng: 'en',
                props: [
                  {
                    id: propIds.value.titlePropId,
                    data: ['Todo'],
                  },
                  {
                    id: propIds.value.slugPropId,
                    data: ['todo'],
                  },
                  {
                    id: propIds.value.descPropId,
                    data: [data.description],
                  },
                  {
                    id: propIds.value.donePropId,
                    data: [false],
                  },
                ],
              },
            ],
            content: [],
          });
        },
        async (result) => {
          todoEntries.value.push(result);
        }
      );
    }

    async function editTodo(todo: Todo, data: TodoAddEditModalOutputData) {
      await window.bcms.util.throwable(
        async () => {
          return await window.bcms.sdk.entry.update({
            _id: todo._id,
            templateId: template.value?._id || '',
            content: [],
            meta: [
              {
                lng: 'en',
                props: [
                  {
                    id: propIds.value.titlePropId,
                    data: ['Todo'],
                  },
                  {
                    id: propIds.value.slugPropId,
                    data: ['todo'],
                  },
                  {
                    id: propIds.value.descPropId,
                    data: [data.description],
                  },
                  {
                    id: propIds.value.donePropId,
                    data: [todo.done],
                  },
                ],
              },
            ],
          });
        },
        async (result) => {
          for (let i = 0; i < todoEntries.value.length; i++) {
            const todoEntry = todoEntries.value[i];
            if (todo._id === todoEntry._id) {
              todoEntries.value[i] = result;
              break;
            }
          }
        }
      );
    }

    async function toggleDone(todo: Todo) {
      await window.bcms.util.throwable(
        async () => {
          return await window.bcms.sdk.entry.update({
            _id: todo._id,
            templateId: template.value?._id || '',
            content: [],
            meta: [
              {
                lng: 'en',
                props: [
                  {
                    id: propIds.value.titlePropId,
                    data: ['Todo'],
                  },
                  {
                    id: propIds.value.slugPropId,
                    data: ['todo'],
                  },
                  {
                    id: propIds.value.descPropId,
                    data: [todo.description],
                  },
                  {
                    id: propIds.value.donePropId,
                    data: [!todo.done],
                  },
                ],
              },
            ],
          });
        },
        async (result) => {
          for (let i = 0; i < todoEntries.value.length; i++) {
            const todoEntry = todoEntries.value[i];
            if (todoEntry._id === todo._id) {
              todoEntries.value[i] = result;
              break;
            }
          }
        }
      );
    }

    return () => (
      <div class="dark:text-white grid grid-cols-2 gap-10">
        <TodoItems
          title={`Todo (${todos.value.filter((e) => !e.done).length})`}
        >
          <li>
            <button
              class="dark:bg-darkGrey rounded p-4 w-full flex justify-center"
              onClick={async () => {
                window.bcms.modal.custom.addEditTodo.show({
                  onDone: addTodo,
                });
              }}
            >
              Create todo
            </button>
          </li>
          {todos.value
            .filter((todo) => !todo.done)
            .map((todo) => {
              return (
                <TodoItem
                  item={todo}
                  onDone={async () => {
                    await toggleDone(todo);
                  }}
                  onEdit={() => {
                    window.bcms.modal.custom.addEditTodo.show({
                      description: todo.description,
                      async onDone(data) {
                        await editTodo(todo, data);
                      },
                    });
                  }}
                />
              );
            })}
        </TodoItems>
        <TodoItems title={`Done (${todos.value.filter((e) => e.done).length})`}>
          {todos.value
            .filter((todo) => todo.done)
            .map((todo) => {
              return (
                <TodoItem
                  item={todo}
                  onDone={async () => {
                    await toggleDone(todo);
                  }}
                  onEdit={() => {
                    window.bcms.modal.custom.addEditTodo.show({
                      description: todo.description,
                      async onDone(data) {
                        await editTodo(todo, data);
                      },
                    });
                  }}
                />
              );
            })}
        </TodoItems>
      </div>
    );
  },
});
