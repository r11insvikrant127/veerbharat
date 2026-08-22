// src/services/base.service.ts

import { Model } from "mongoose";

import { connectDB } from "@/lib/mongoose";
import ApiError from "@/lib/ApiError";

export default abstract class BaseService {
  protected async connect() {
    await connectDB();
  }

  /* =====================================================
     FIND BY PUBLIC ID OR THROW
  ===================================================== */

  protected async findByPublicIdOrThrow<T>(
    model: Model<T>,
    idField: string,
    id: string,
    entityName: string
  ) {
    const document = await model.findOne({
      [idField]: id,
    });

    if (!document) {
      throw new ApiError(
        404,
        `${entityName} not found.`
      );
    }

    return document;
  }
}
