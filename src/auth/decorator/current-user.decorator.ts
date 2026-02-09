import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from 'src/user/entity/user.entity';
import { RequestWithUser } from '../guard/roles.guard';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): User => {
    // RequestWithUser는 “request에 user: User가 있다”는 타입만 정의한 것
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();
    return request.user;
  },
);
