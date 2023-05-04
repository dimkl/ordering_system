import Router from "koa-router";

import { router as CustomersRouter } from "./customers/router";
import { router as OrdersRouter } from "./orders/router";
import { router as ProductsRouter } from "./products/router";
import { router as AvailabilityRouter } from "./availability/router";
import { router as ShopsRouter } from "./shops/router";
import { router as DiscoveryRouter } from "./discovery/router";

export const router = new Router();

router.use(CustomersRouter.routes());
router.use(OrdersRouter.routes());
router.use(ProductsRouter.routes());
router.use(AvailabilityRouter.routes());
router.use(ShopsRouter.routes());
router.use(DiscoveryRouter.routes());
