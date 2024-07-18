import { BusinessError } from "../shared/errors";

export class ProductOfVariationRequired extends BusinessError {
  message = "A variation should be a variant of a product, not of another variation";
}
