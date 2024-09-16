import { Request, Response, NextFunction } from "express";
import {
  addProductService,
  deletedUserProductsService,
  getProductService,
  getUserProductsService,
  updateUserProductsService,
} from "../services/productService";
import { UpdateProductParams } from "../types/types";
const addProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = req.body;
    const product = await addProductService({
      createdBy: res.locals.userId,
      ...body,
    });
    return res.status(201).json({
      product,
      message: "Product added successfully",
      status: "completed",
    });
  } catch (error) {
    next(error);
  }
};

const getProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id);
    const product = await getProductService(+id);
    return res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};
const getUserProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = res.locals.userId;
    const product = await getUserProductsService(+userId);
    return res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};
const updateUserProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const productId = req.params.id;
    const userId = res.locals.userId;
    const body = req.body as UpdateProductParams;
    const product = await updateUserProductsService(+userId, +productId, body);
    return res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

const deleteUserProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const productId = req.params.id;
    const userId = res.locals.userId;
    const product = await deletedUserProductsService(+userId, +productId);
    return res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

export {
  addProduct,
  getProduct,
  getUserProducts,
  updateUserProduct,
  deleteUserProduct,
};
