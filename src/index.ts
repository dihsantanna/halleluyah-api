import 'express-async-errors'
import 'tsconfig-paths/register'

import { app } from './app'
import { env } from './config/env'

app.listen(env.PORT, () => {
  console.log(`Server is running on port ${env.PORT}`)
})
