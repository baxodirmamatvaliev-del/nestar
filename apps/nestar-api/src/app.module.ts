import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver } from '@nestjs/apollo'
import { AppResolver } from './app.resolver';
import { ComponentsModule } from './components/components.module';
import { DatabaseModule } from './database/database.module';
import { T } from './libs/types/common';

@Module({
  imports:
   [ConfigModule.forRoot(),  // N1 qoyilishi shart orqali biz .env ni oqishimiz mumkin bolar ekan
    GraphQLModule.forRoot({ // GraphQL APi backend server qlb olyapmiz  
    driver: ApolloDriver,
    playground: true,
    uploads: false,
    autoSchemaFile: true,
    formatError: (error: T) => { // Error handling GL. qlib ozimzni error larimizni yaratyapz
      const graphQLformattedError = {
        code: error?.extensions.code,
        message: error?.extensions?.excepton?.response?.message 
        || error?.extensions?.response?.message || error?.message,
      }
      console.log("GRAPHQL GLOBALL ERROR!",graphQLformattedError)
      return graphQLformattedError; // reaponse: users
    }
  }), 
  ComponentsModule, // asosiy mantiq yani modullar  
  DatabaseModule
],
  controllers: [AppController],
  providers: [AppService, AppResolver],
})
export class AppModule {}
   