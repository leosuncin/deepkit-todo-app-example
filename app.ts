import { App } from '@deepkit/app';
import { FrameworkModule } from '@deepkit/framework';
import { JSONTransport, Logger } from '@deepkit/logger';

import { AppConfig } from './src/app/config';
import { Service } from './src/app/service';
import { TaskService } from './src/app/task.service';
import { HelloWorldControllerCli } from './src/controller/hello-world.cli';
import { HelloWorldControllerHttp } from './src/controller/hello-world.http';
import { HelloWorldControllerRpc } from './src/controller/hello-world.rpc';
import {
  TaskCreateCommand,
  TaskListCommand,
} from './src/controller/task.controller.cli';

new App({
  config: AppConfig,
  controllers: [
    HelloWorldControllerCli,
    HelloWorldControllerHttp,
    HelloWorldControllerRpc,
    TaskListCommand,
    TaskCreateCommand,
  ],
  providers: [Service, TaskService],
  imports: [new FrameworkModule({ debug: true })],
})
  .loadConfigFromEnv({ envFilePath: ['production.env', '.env'] })
  .setup((module, config: AppConfig) => {
    if (config.environment === 'production') {
      // enable logging JSON messages instead of formatted strings
      // @ts-expect-error missing type
      module.setupGlobalProvider<Logger>().setTransport([new JSONTransport()]);

      // disable debugging
      module
        .getImportedModuleByClass(FrameworkModule)
        .configure({ debug: false });
    }
  })
  .run();
