import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { decimalTransformer } from '../../common/transformers/decimal.transformer';
import { Gender } from '../enums/gender.enum';
import { GuidelineCategory } from '../enums/guideline-category.enum';

@Entity('body_data')
@Index(['gender', 'guidelineCategory'])
@Index(['height', 'weight'])
export class BodyData {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: Gender })
  gender: Gender;

  @Column({ type: 'decimal', precision: 5, scale: 1, transformer: decimalTransformer })
  height: number;

  @Column({ type: 'decimal', precision: 5, scale: 1, transformer: decimalTransformer })
  weight: number;

  @Column({
    name: 'chest_circumference',
    type: 'decimal',
    precision: 5,
    scale: 1,
    transformer: decimalTransformer,
  })
  chestCircumference: number;

  @Column({
    name: 'waist_circumference',
    type: 'decimal',
    precision: 5,
    scale: 1,
    transformer: decimalTransformer,
  })
  waistCircumference: number;

  @Column({
    name: 'hip_circumference',
    type: 'decimal',
    precision: 5,
    scale: 1,
    transformer: decimalTransformer,
  })
  hipCircumference: number;

  @Column({ name: 'guideline_category', type: 'enum', enum: GuidelineCategory })
  guidelineCategory: GuidelineCategory;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
