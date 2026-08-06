// src/services/base.service.ts

import { connectDB } from "@/lib/mongoose";

export default abstract class BaseService {
  protected async connect() {
    await connectDB();
  }
}