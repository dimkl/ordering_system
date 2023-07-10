import Koa from "koa";
import AdminJS from "adminjs";

import { Adapter, Resource, Database } from "@adminjs/sql";
import AdminJSKoa from "@adminjs/koa";

const PORT = 3002;

AdminJS.registerAdapter({
  Database,
  Resource,
});

// ...

const PgAdapter = new Adapter("postgresql", {
  connectionString: "postgresql://postgres@localhost:5432/ordering_system",
  database: "ordering_system",
});

PgAdapter.init().then((db) => {
  const start = async () => {
    const app = new Koa();
    const admin = new AdminJS({
      databases: [db],
      rootPath: "/admin",
    });

    const router = AdminJSKoa.buildRouter(admin, app);

    app.use(router.routes()).use(router.allowedMethods());

    app.listen(PORT, () => {
      console.log(
        `AdminJS available at http://localhost:${PORT}${admin.options.rootPath}`
      );
    });
  };

  return start();
});
