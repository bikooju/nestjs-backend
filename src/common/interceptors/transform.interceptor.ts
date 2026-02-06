import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * API 성공 응답 공통 포맷
 * @template T - 컨트롤러가 반환하는 데이터 타입
 */
export interface TransformResponse<T> {
  success: true;
  data: T;
  timestamp: string;
}

/** 컨트롤러 반환값을 { success, data, timestamp } 형태로 감싸서 응답 형식을 통일한다. */
@Injectable()
export class TransformInterceptor implements NestInterceptor {
  /** 핸들러가 반환한 값을 가로채서 공통 포맷으로 감싼 뒤 클라이언트에 내보낸다. */
  intercept<T>(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<TransformResponse<T>> {
    // next.handle() → 실제 컨트롤러 실행, Observable로 결과 스트림 반환
    return next.handle().pipe(
      // 스트림 안의 값(data)을 { success, data, timestamp } 객체로 변환
      map((data) => ({
        success: true,
        data: data,
        timestamp: new Date().toISOString(),
      })),
    );
  }
}
