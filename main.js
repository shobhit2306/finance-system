import applicationStack from "./app.js";
import seedSuperAdmin from "./helpers/seedSuperAdmin.js";

 const {
    attachCoreMiddlewares,
    attachExternalMiddlewares,
    attachRouters,
    upServer
  } = applicationStack,
  bootstrap = async () => {
    await attachCoreMiddlewares();
    await attachExternalMiddlewares();
    await attachRouters();
    await upServer();
    await seedSuperAdmin();
  };
await bootstrap();