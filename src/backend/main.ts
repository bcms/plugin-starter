import { HelloWorldController } from './controllers';
import { createBcmsPlugin } from '@bcms/plugin';

export default createBcmsPlugin({
  name: 'Hello world',
  controllers: [HelloWorldController],
});
