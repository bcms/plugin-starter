import type {
  BCMSRouteProtectionJwtAndBodyCheckResult,
  BCMSRouteProtectionJwtResult,
} from '@becomes/cms-backend/src/types';
import { BCMSRouteProtection } from '@becomes/cms-backend/src/util';
import {
  createController,
  createControllerMethod,
} from '@becomes/purple-cheetah';
import {
  JWTPermissionName,
  JWTRoleName,
} from '@becomes/purple-cheetah-mod-jwt/types';
import { HTTPStatus, ObjectSchema } from '@becomes/purple-cheetah/types';
import { Types } from 'mongoose';
import { Repo } from '../repo';
import type { Todo } from './models';
import { createTodoRepo } from './repo';

interface CreateBodyData {
  description: string;
}
const CreateBodyDataSchema: ObjectSchema = {
  description: {
    __type: 'string',
    __required: true,
  },
};

interface UpdateBodyData {
  _id: string;
  description?: string;
  done?: boolean;
}
const UpdateBodyDataSchema: ObjectSchema = {
  _id: {
    __type: 'string',
    __required: true,
  },
  description: {
    __type: 'string',
    __required: false,
  },
  done: {
    __type: 'boolean',
    __required: false,
  },
};

export const TodoController = createController({
  name: 'Todo',
  path: '/todo',
  async setup() {
    createTodoRepo();
  },
  methods() {
    return {
      getAll: createControllerMethod<
        BCMSRouteProtectionJwtResult,
        { items: Todo[] }
      >({
        path: '/all',
        type: 'get',
        preRequestHandler: BCMSRouteProtection.createJwtPreRequestHandler(
          [JWTRoleName.ADMIN, JWTRoleName.USER],
          JWTPermissionName.READ
        ),
        async handler() {
          return {
            items: await Repo.todo.findAll(),
          };
        },
      }),

      getByDescription: createControllerMethod<
        BCMSRouteProtectionJwtResult,
        { item: Todo }
      >({
        path: '/:description',
        type: 'get',
        preRequestHandler: BCMSRouteProtection.createJwtPreRequestHandler(
          [JWTRoleName.ADMIN, JWTRoleName.USER],
          JWTPermissionName.READ
        ),
        async handler({ request, errorHandler }) {
          const todo = await Repo.todo.methods.findByDescription(
            request.params.description
          );
          if (!todo) {
            throw errorHandler.occurred(
              HTTPStatus.NOT_FOUNT,
              `Todo with ID "${request.params.description}" does not exist.`
            );
          }
          return {
            item: todo,
          };
        },
      }),

      create: createControllerMethod<
        BCMSRouteProtectionJwtAndBodyCheckResult<CreateBodyData>,
        { item: Todo }
      >({
        type: 'post',
        preRequestHandler:
          BCMSRouteProtection.createJwtAndBodyCheckPreRequestHandler({
            roleNames: [JWTRoleName.ADMIN, JWTRoleName.USER],
            permissionName: JWTPermissionName.WRITE,
            bodySchema: CreateBodyDataSchema,
          }),
        async handler({ body }) {
          const todo = await Repo.todo.methods.findByDescription(
            body.description
          );
          if (todo) {
            return { item: todo };
          }
          return {
            item: await Repo.todo.add({
              _id: `${new Types.ObjectId()}`,
              createdAt: Date.now(),
              updatedAt: Date.now(),
              description: body.description,
              done: false,
            }),
          };
        },
      }),

      update: createControllerMethod<
        BCMSRouteProtectionJwtAndBodyCheckResult<UpdateBodyData>,
        { item: Todo }
      >({
        type: 'put',
        preRequestHandler:
          BCMSRouteProtection.createJwtAndBodyCheckPreRequestHandler({
            roleNames: [JWTRoleName.ADMIN, JWTRoleName.USER],
            permissionName: JWTPermissionName.WRITE,
            bodySchema: UpdateBodyDataSchema,
          }),
        async handler({ body, errorHandler }) {
          const todo = await Repo.todo.findById(body._id);
          if (!todo) {
            throw errorHandler.occurred(
              HTTPStatus.NOT_FOUNT,
              `Todo "${body._id}" does not exist.`
            );
          }
          if (body.description) {
            const todoWithDescription =
              await Repo.todo.methods.findByDescription(body.description);
            if (todoWithDescription) {
              throw errorHandler.occurred(
                HTTPStatus.BAD_REQUEST,
                `Todo "${body.description}" already exist.`
              );
            }
            todo.description = body.description;
          }
          if (typeof body.done === 'boolean') {
            todo.done = body.done;
          }
          return {
            item: await Repo.todo.update(todo),
          };
        },
      }),

      deleteById: createControllerMethod<
        BCMSRouteProtectionJwtResult,
        { item: Todo }
      >({
        path: '/:id',
        type: 'delete',
        preRequestHandler: BCMSRouteProtection.createJwtPreRequestHandler(
          [JWTRoleName.ADMIN, JWTRoleName.USER],
          JWTPermissionName.DELETE
        ),
        async handler({ request, errorHandler }) {
          const todo = await Repo.todo.findById(request.params.id);
          if (!todo) {
            throw errorHandler.occurred(
              HTTPStatus.NOT_FOUNT,
              `Todo "${request.params.id}" does not exist.`
            );
          }
          await Repo.todo.deleteById(request.params.id);
          return { item: todo };
        },
      }),
    };
  },
});
