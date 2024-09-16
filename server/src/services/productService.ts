import Product from "../db/models/Product";
import User from "../db/models/User";
import { CustomError } from "../errors/customError";
import { addProductParams, UpdateProductParams } from "../types/types";

type SafeProduct = Omit<Product, "deletedAt">;

const addProductService = async (
  data: addProductParams
): Promise<SafeProduct> => {
  try {
    const product = Product.build({ ...data });
    await product.validate();
    await product.save();

    const fullProduct = product.get();
    const { deletedAt, ...safeProduct } = fullProduct;

    return safeProduct as SafeProduct;
  } catch (error) {
    console.error("Error adding product:", error);
    throw error;
  }
};

const getProductService = async (id: number): Promise<SafeProduct> => {
  try {
    if (isNaN(id)) {
      throw new CustomError("Invalid product ID", 400, true);
    }
    const product = await Product.findByPk(id, {
      attributes: { exclude: ["deletedAt"] },
    });

    if (!product) {
      throw new CustomError("Product not found", 404, true);
    }
    return product.get() as SafeProduct;
  } catch (error) {
    console.error("Error getting product:", error);
    throw error;
  }
};

const getUserProductsService = async (id: number): Promise<SafeProduct[]> => {
  try {
    if (isNaN(id)) {
      throw new CustomError("Invalid product ID", 400, true);
    }

    // if you want to return deleted products set paranoid to true
    const products = await Product.findAll({
      where: {
        createdBy: id,
      },
      include: {
        model: User,
        as: "user",
        attributes: ["username"],
      },
      attributes: { exclude: ["deletedAt"] },
    });

    if (!products) {
      throw new CustomError("Product not found", 404, true);
    }
    return products.map((product) => product.get() as SafeProduct);
  } catch (error) {
    console.error("Error getting product:", error);
    throw error;
  }
};

const updateUserProductsService = async (
  userId: number,
  productId: number,
  data: UpdateProductParams
): Promise<SafeProduct> => {
  try {
    if (isNaN(userId) || isNaN(productId)) {
      throw new CustomError("Invalid product ID or user ID", 400, true);
    }
    const product = await Product.findOne({
      where: { id: productId, createdBy: userId },
      attributes: { exclude: ["deletedAt"] },
    });
    if (!product) {
      throw new CustomError("Product not found", 404, true);
    }

    Object.keys(data).forEach((key) => {
      if (data[key as keyof UpdateProductParams] !== undefined) {
        product.set(key, data[key as keyof UpdateProductParams]);
      }
    });
    product.set("updatedAt", new Date());
    await product.save();
    return product.get() as SafeProduct;
  } catch (error) {
    console.error("Error getting product:", error);
    throw error;
  }
};

const deletedUserProductsService = async (
  userId: number,
  productId: number
): Promise<Date> => {
  try {
    if (isNaN(userId) || isNaN(productId)) {
      throw new CustomError("Invalid product ID or user ID", 400, true);
    }
    const product = await Product.findOne({
      where: { id: productId, createdBy: userId },
    });
    if (!product) {
      throw new CustomError("Product not found", 404, true);
    }
    // since paranoid is enabled it will set the value of deletedAt
    await product.destroy();
    return product.get().deletedAt;
  } catch (error) {
    console.error("Error getting product:", error);
    throw error;
  }
};

export {
  addProductService,
  getProductService,
  getUserProductsService,
  updateUserProductsService,
  deletedUserProductsService,
};
