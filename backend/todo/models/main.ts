import {
  FSDBEntity,
  FSDBEntitySchema,
} from '@becomes/purple-cheetah-mod-fsdb/types';
import type { ObjectSchema } from '@becomes/purple-cheetah/types';

export interface Todo extends FSDBEntity {
  description: string;
  done: boolean;
}

export const TodoSchema: ObjectSchema = {
  ...FSDBEntitySchema,
  description: {
    __type: 'string',
    __required: true,
  },
  done: {
    __type: 'boolean',
    __required: true,
  },
};
