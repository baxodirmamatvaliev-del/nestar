import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver } from '@nestjs/apollo'
import { AppResolver } from './app.resolver';
import { ComponentsModule } from './components/components.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports:
   [ConfigModule.forRoot(),//ConfigModule.forRoot() orqali biz .env ni oqishimiz mumkin bolar ekan
    GraphQLModule.forRoot({ 
    driver: ApolloDriver,
    playground: true,
    uploads: false,
    autoSchemaFile: true,
  }), 
  ComponentsModule, // asosiy mantiq yani modullar  
  DatabaseModule
],
  controllers: [AppController],
  providers: [AppService, AppResolver],
})
export class AppModule {}
   