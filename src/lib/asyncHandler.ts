import { NextRequest, NextResponse } from "next/server";
import ApiError from "./ApiError";

type RouteHandler<T = unknown> = (
  request: NextRequest,
  context: T
) => Promise<Response>;

export function asyncHandler<T = unknown>(
  handler: RouteHandler<T>
) {
  return async (
    request: NextRequest,
    context: T
  ): Promise<Response> => {
    try {
      return await handler(request, context);
    } catch (error) {
      if (error instanceof ApiError) {
        return NextResponse.json(
          {
            success: false,
            message: error.message,
            errors: error.errors,
          },
          {
            status: error.statusCode,
          }
        );
      }

      console.error(error);

      return NextResponse.json(
        {
          success: false,
          message: "Internal Server Error",
        },
        {
          status: 500,
        }
      );
    }
  };
}

export default asyncHandler;