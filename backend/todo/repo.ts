import { BCMSConfig } from '@becomes/cms-backend/config';
import type { FSDBRepository } from '@becomes/purple-cheetah-mod-fsdb/types';
import { createFSDBRepository } from '@becomes/purple-cheetah-mod-fsdb';
import type { MongoDBCachedRepository } from '@becomes/purple-cheetah-mod-mongodb-mem-cache/types';
import { createMongoDBCachedRepository } from '@becomes/purple-cheetah-mod-mongodb-mem-cache';
import { objectSchemaToMongoDBSchema } from '@becomes/purple-cheetah-mod-mongodb';
import { Repo } from '../repo';
import { Todo, TodoSchema } from './models';
import { PLUGIN_NAME_SLUG } from '../name';

export interface TodoRepoMethods {
  findByDescription(description: string): Promise<Todo | null>;
  findAllByDone(done: boolean): Promise<Todo[]>;
}

export type TodoRepo =
  | FSDBRepository<Todo, TodoRepoMethods>
  | MongoDBCachedRepository<Todo, TodoRepoMethods>;

export function createTodoRepo(): void {
  const name = 'Todo';
  const collection = `${BCMSConfig.database.prefix}_${PLUGIN_NAME_SLUG}_todo`;
  if (BCMSConfig.database.fs) {
    Repo.todo = createFSDBRepository({
      name,
      collection,
      schema: TodoSchema,
      methods({ repo }) {
        return {
          async findAllByDone(done) {
            return await repo.findAllBy((e) => e.done === done);
          },

          async findByDescription(description) {
            return await repo.findBy((e) => e.description === description);
          },
        };
      },
    });
  } else {
    Repo.todo = createMongoDBCachedRepository({
      name,
      collection,
      schema: objectSchemaToMongoDBSchema(TodoSchema),
      methods({ mongoDBInterface, cacheHandler }) {
        const latches: {
          [name: string]: boolean;
        } = {};
        return {
          async findAllByDone(done) {
            const latchKey = 'done_' + done;
            if (latches[latchKey]) {
              return cacheHandler.find((e) => e.done === done);
            }
            const items = await mongoDBInterface.find({ done });
            items.forEach((e) => cacheHandler.set(e._id, e));
            latches[latchKey] = true;
            return items;
          },

          async findByDescription(description) {
            const cacheHit = cacheHandler.findOne(
              (e) => e.description === description
            );
            if (cacheHit) {
              return cacheHit;
            }
            const item = await mongoDBInterface.findOne({ description });
            if (item) {
              cacheHandler.set(item._id, item);
            }
            return item;
          },
        };
      },
    });
  }
}
