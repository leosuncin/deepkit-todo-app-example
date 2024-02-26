import { App } from '@deepkit/app';
import { FrameworkModule } from '@deepkit/framework';
import { JSONTransport, Logger } from '@deepkit/logger';
import { Database } from '@deepkit/orm';
import { SQLiteDatabaseAdapter } from '@deepkit/sqlite';

import { AppConfig } from './src/app/config';
import { Service } from './src/app/service';
import { TaskParameterResolver } from './src/app/task-parameter.resolver';
import { Task } from './src/app/task.entity';
import { TaskService } from './src/app/task.service';
import { HelloWorldControllerCli } from './src/controller/hello-world.cli';
import { HelloWorldControllerHttp } from './src/controller/hello-world.http';
import { HelloWorldControllerRpc } from './src/controller/hello-world.rpc';
import {
  TaskCreateCommand,
  TaskListCommand,
} from './src/controller/task.controller.cli';
import { TaskControllerHttp } from './src/controller/task.controller.http';
import { TaskControllerRpc } from './src/controller/task.controller.rpc';

new App({
  config: AppConfig,
  controllers: [
    HelloWorldControllerCli,
    HelloWorldControllerHttp,
    HelloWorldControllerRpc,
    TaskListCommand,
    TaskCreateCommand,
    TaskControllerHttp,
    TaskControllerRpc,
  ],
  providers: [
    {
      provide: Database,
      useFactory() {
        return new Database(new SQLiteDatabaseAdapter('app.db'), [Task]);
      },
    },
    Service,
    TaskService,
    TaskParameterResolver,
  ],
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
