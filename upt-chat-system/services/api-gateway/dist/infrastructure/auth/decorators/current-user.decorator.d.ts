export interface CurrentUserDto {
    userId: string;
    email: string;
    userType: string;
}
export declare const CurrentUser: (...dataOrPipes: (keyof CurrentUserDto | import("@nestjs/common").PipeTransform<any, any> | import("@nestjs/common").Type<import("@nestjs/common").PipeTransform<any, any>> | undefined)[]) => ParameterDecorator;
