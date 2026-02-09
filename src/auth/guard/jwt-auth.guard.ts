import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

/**
 * JWT 인증 가드
 * 라우트 핸들러 실행 전에 JWT 토큰 유효성을 검사합니다.
 * @Public() 데코레이터가 붙은 라우트는 인증 없이 접근 가능합니다.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  /** Reflector: @Public() 등 메타데이터 조회용. super(): 부모 AuthGuard('jwt') 초기화 */
  constructor(private reflector: Reflector) {
    super();
  }

  /**
   * 라우트 접근 허용 여부 결정
   * - 핸들러/클래스에 isPublic 메타데이터가 있으면 인증 없이 통과
   * - 그 외에는 JWT 전략(JwtStrategy)으로 토큰 검증 후 통과/거부
   */
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      // isPublic 메타데이터 읽기
      context.getHandler(), // 메서드 레벨
      context.getClass(), // 클래스 레벨
    ]);

    if (isPublic) {
      return true;
    }

    return super.canActivate(context);
  }
}
