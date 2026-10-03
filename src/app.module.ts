import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CompaniesModule } from './companies/companies.module';
import { CustomersModule } from './customers/customers.module';
import { ProductsModule } from './products/products.module';
import { QuotesModule } from './quotes/quotes.module';
import { NotificationsModule } from './notifications/notifications.module';
import { PublicModule } from './public/public.module';
import { PdfModule } from './pdf/pdf.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    CompaniesModule,
    CustomersModule,
    ProductsModule,
    QuotesModule,
    NotificationsModule,
    PublicModule,
    PdfModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
