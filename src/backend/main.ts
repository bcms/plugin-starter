import { HelloWorldController } from './controllers';
import { createBcmsPlugin } from '@bcms/plugin';

export default createBcmsPlugin({
  name: process.env.VUE_APP_PLUGIN_NAME as string,
  controllers: [HelloWorldController],
}); 
