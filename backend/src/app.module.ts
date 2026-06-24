import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';

@Module({
  imports: [
  ConfigModule.forRoot({
    isGlobal: true,
  }),

MongooseModule.forRootAsync({
  inject: [ConfigService],
  useFactory: (
    configService: ConfigService,
  ) => ({
    uri: configService.get<string>(
      'MONGODB_URI',
    ),
  }),
}),
  
  ServeStaticModule.forRoot({
  rootPath: join(__dirname, '..', 'uploads'),
  serveRoot: '/uploads',
}),

  AuthModule,
  UsersModule,
  PostsModule,
],
})
export class AppModule {constructor() {
    console.log(
      'JWT:',
      process.env.JWT_SECRET,
    );

    console.log(
      'CLOUD:',
      process.env.CLOUDINARY_CLOUD_NAME,
    );
  }}