
import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    private readonly logger: Logger = new Logger();

  public intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const recordTime = Date.now();
    const requestType = context.getType<GqlContextType>(); // qanday req: kelaotganini blib olish uchun 
    

    if (requestType === "http") {
    // ** Develop if needet //
      return next.handle()
    } else if ( requestType === "graphql") {
        const gqContext = GqlExecutionContext.create(context);
        console.log("gqContext =>",); 
        this.logger.log(`${this.stringify(gqContext.getContext().req.body)}`,`Request`); 

         // ** (2) Error handling via graphQL  *//
     
       
      // ** (3) no Errors giving Response below  *//
         
     return next.handle().pipe(
        tap((context) => {
       const responseTime = Date.now() - recordTime;
        this.logger.log(` ${this.stringify(context)} ${recordTime}ms \n\n`,`Request`);
        }),
      );
    } 
    return next.handle();  
  }
  private stringify(context: ExecutionContext): string {
   return  JSON.stringify(context).slice(0, 75);
  } 
}
