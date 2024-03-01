import { App } from '@deepkit/app';
import { FrameworkModule } from '@deepkit/framework';
import { JSONTransport, Logger } from '@deepkit/logger';
import { Database } from '@deepkit/orm';
import { SQLiteDatabaseAdapter } from '@deepkit/sqlite';

import { AppConfig } from './src/app/config';
import { Service } from './src/app/service';
import { HelloWorldControllerCli } from './src/controller/hello-world.cli';
import { HelloWorldControllerHttp } from './src/controller/hello-world.http';
import { HelloWorldControllerRpc } from './src/controller/hello-world.rpc';
import { Task } from './src/todo-list/task.entity';
import { TodoListModule } from './src/todo-list/todo-list.module';

new App({
  config: AppConfig,
  controllers: [
    HelloWorldControllerCli,
    HelloWorldControllerHttp,
    HelloWorldControllerRpc,
  ],
  providers: [
    {
      provide: Database,
      useFactory() {
        return new Database(new SQLiteDatabaseAdapter('app.db'), [Task]);
      },
    },
    Service,
  ],
  imports: [new FrameworkModule({ debug: true }), new TodoListModule()],
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
