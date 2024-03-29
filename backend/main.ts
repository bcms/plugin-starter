import { createBcmsPlugin } from '@becomes/cms-backend/plugin';
import { TodoController } from './todo';

export default createBcmsPlugin({
  name: 'bcms-plugin---name',
  controllers: [TodoController],
});
