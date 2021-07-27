import { HelloWorldController } from './controllers';
import { createBcmsPlugin } from './_helper';

export const plugin = createBcmsPlugin({
  name: 'Hello world',
  controllers: [HelloWorldController],
});
