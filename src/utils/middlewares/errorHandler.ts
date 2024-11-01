import type { NextFunction, Request, Response } from 'express'
import { ZodError } from 'zod'

import { AppError } from '@/utils/errors/AppError'
import { ValidationError } from '@/utils/errors/ValidationError'

export const errorHandler = (
  error: Error,
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      status: 'error',
      message: error.message,
    })
    return
  }

  if (error instanceof ZodError) {
    res.status(400).json({
      status: 'error',
      message: 'Validation error',
      errors: error.errors,
    })
    return
  }

  if (error instanceof ValidationError) {
    res.status(error.statusCode).json({
      status: 'error',
      message: 'Validation error',
      errors: error.errors,
    })
    return
  }
  if (error) {
    console.error(JSON.stringify(error, null, 2))
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    })
    return
  }

  next()
}
