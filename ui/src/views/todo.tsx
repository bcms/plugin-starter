import type { Todo } from '@backend/todo';
import { computed, defineComponent, onMounted, ref } from 'vue';
import { TodoAddEditModalOutputData, TodoItem, TodoItems } from '../components';

const component = defineComponent({
  setup() {
    const rawTodos = ref<Todo[]>([]);
    const todos = computed(() => {
      return rawTodos.value
        .map((e) => e)
        .sort((a, b) => b.createdAt - a.createdAt);
    });

    onMounted(async () => {
      window.bcms.util.throwable(
        async () => {
          return await window.bcms.sdk.send<{ items: Todo[] }>({
            url: '/plugin/bcms-plugin---name/todo/all',
            headers: {
              Authorization: '',
            },
          });
        },
        async (result) => {
          rawTodos.value = result.items;
        }
      );
    });

    async function addTodo(data: TodoAddEditModalOutputData) {
      await window.bcms.util.throwable(
        async () => {
          return await window.bcms.sdk.send<{ item: Todo }>({
            url: '/plugin/bcms-plugin---name/todo',
            method: 'POST',
            headers: {
              Authorization: '',
            },
            data,
          });
        },
        async (result) => {
          todos.value.push(result.item);
        }
      );
    }

    async function editTodo(id: string, data: TodoAddEditModalOutputData) {
      await window.bcms.util.throwable(
        async () => {
          return await window.bcms.sdk.send<{ item: Todo }>({
            url: '/plugin/bcms-plugin---name/todo',
            method: 'PUT',
            headers: {
              Authorization: '',
            },
            data: {
              _id: id,
              ...data,
            },
          });
        },
        async (result) => {
          for (let i = 0; i < todos.value.length; i++) {
            const todo = todos.value[i];
            if (todo._id === id) {
              todos.value[i] = result.item;
              break;
            }
          }
        }
      );
    }

    async function toggleDone(todo: Todo) {
      window.bcms.util.throwable(
        async () => {
          return await window.bcms.sdk.send({
            url: '/plugin/bcms-plugin---name/todo',
            method: 'PUT',
            headers: {
              Authorization: '',
            },
            data: {
              _id: todo._id,
              done: !todo.done,
            },
          });
        },
        async () => {
          todo.done = !todo.done;
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
                        await editTodo(todo._id, data);
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
                        await editTodo(todo._id, data);
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
export default component;
