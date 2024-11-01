interface ErrorType {
  message: string
  key: string
}

const parseError = (issues: ErrorType[]) =>
  issues.reduce(
    (acc, { message, key }) => {
      Object.assign(acc, { [key]: message })

      return acc
    },
    {} as { [key: string]: string },
  )

export class ValidationError extends Error {
  public readonly errors: {
    [key: string]: string
  }
  public readonly statusCode: number

  constructor(issues: ErrorType[], code = 400) {
    super(ValidationError.name)

    this.errors = parseError(issues)
    this.statusCode = code
  }
}
