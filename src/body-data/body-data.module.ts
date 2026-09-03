import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BodyDataController } from './body-data.controller';
import { BodyDataService } from './body-data.service';
import { BodyData } from './entities/body-data.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BodyData])],
  controllers: [BodyDataController],
  providers: [BodyDataService],
  exports: [BodyDataService],
})
export class BodyDataModule {}
