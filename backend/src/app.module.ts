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

  MongooseModule.forRoot(
    'mongodb://ginosohro_db_user:ItGoDvWx3S6hJDU9@ac-lpkqasd-shard-00-00.ezznrwd.mongodb.net:27017,ac-lpkqasd-shard-00-01.ezznrwd.mongodb.net:27017,ac-lpkqasd-shard-00-02.ezznrwd.mongodb.net:27017/red-social?ssl=true&replicaSet=atlas-efhl8v-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0',
  ),
  
  ServeStaticModule.forRoot({
  rootPath: join(__dirname, '..', 'uploads'),
  serveRoot: '/uploads',
}),

  AuthModule,
  UsersModule,
  PostsModule,
],
})
export class AppModule {}