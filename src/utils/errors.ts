interface NestErrorShape {
  statusCode: number;
  message: string;
}

export function isNestError(err: unknown): err is NestErrorShape {
  if (typeof err !== "object" || err === null) {
    return false;
  }

  return "statusCode" in err && "message" in err;
}
