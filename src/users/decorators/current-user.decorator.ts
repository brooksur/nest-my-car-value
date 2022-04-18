import { createParamDecorator, ExecutionContext, Session } from '@nestjs/common'

export const CurrentUser = createParamDecorator(
  (data: never, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest()
    return request.currentUser
  }
)
