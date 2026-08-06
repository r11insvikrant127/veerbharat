// src/utils/apiResponse.ts

import { NextResponse } from "next/server";

export class ApiResponse {
  static success(
    data: unknown,
    message = "Success",
    status = 200
  ) {
    return NextResponse.json(
      {
        success: true,
        message,
        data,
      },
      {
        status,
      }
    );
  }

  static paginated(
    data: unknown,
    pagination: unknown,
    message = "Success"
  ) {
    return NextResponse.json({
      success: true,
      message,
      data,
      pagination,
    });
  }

  static error(
    message: string,
    status = 500,
    errors: unknown[] = []
  ) {
    return NextResponse.json(
      {
        success: false,
        message,
        errors,
      },
      {
        status,
      }
    );
  }
}