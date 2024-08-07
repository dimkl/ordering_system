import Router from "koa-router";

import { router as HealthRouter } from "./health/router";
import { router as CustomersRouter } from "./customers/router";
import { router as OrdersRouter } from "./orders/router";
import { router as ProductsRouter } from "./products/router";
import { router as AvailabilityRouter } from "./availability/router";
import { router as ShopsRouter } from "./shops/router";
import { router as DiscoveryRouter } from "./discovery/router";
import { apiVersion } from "./shared/middlewares/apiVersion";

export const router = new Router({
  prefix: "/:version"
});

router.use(apiVersion(["2024-07-25"]));

router.use(HealthRouter.routes());
router.use(CustomersRouter.routes());
router.use(OrdersRouter.routes());
router.use(ProductsRouter.routes());
router.use(AvailabilityRouter.routes());
router.use(ShopsRouter.routes());
router.use(DiscoveryRouter.routes());
