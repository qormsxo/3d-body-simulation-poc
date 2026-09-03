import { Gender } from '../../body-data/enums/gender.enum';
import { GuidelineCategory } from '../../body-data/enums/guideline-category.enum';
import { BodyData } from '../../body-data/entities/body-data.entity';

function randomBetween(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function round1(value: number): number {
  return Math.round(value * 10) / 10;
}

function resolveGuidelineCategory(bmi: number): GuidelineCategory {
  if (bmi < 18.5) return GuidelineCategory.SLIM;
  if (bmi < 23) return GuidelineCategory.STANDARD;
  if (bmi < 27) return GuidelineCategory.ATHLETIC;
  return GuidelineCategory.PLUS_SIZE;
}

/**
 * 성별/키에 대략적으로 비례하는 몸무게와 둘레 치수를 생성해
 * 현실적인 분포를 갖는 3D 인체 데이터 샘플을 만든다.
 */
export function generateBodyDataSample(): Partial<BodyData> {
  const gender = Math.random() < 0.5 ? Gender.MALE : Gender.FEMALE;
  const height = round1(gender === Gender.MALE ? randomBetween(160, 195) : randomBetween(150, 180));

  const heightMeters = height / 100;
  const baseBmi = randomBetween(16, 32);
  const weight = round1(baseBmi * heightMeters * heightMeters);

  const chestCircumference = round1(
    (gender === Gender.MALE ? height * 0.52 : height * 0.5) + randomBetween(-4, 6),
  );
  const waistCircumference = round1(chestCircumference * randomBetween(0.78, 0.92));
  const hipCircumference = round1(
    (gender === Gender.MALE ? chestCircumference * 0.98 : chestCircumference * 1.05) +
      randomBetween(-3, 3),
  );

  return {
    gender,
    height,
    weight,
    chestCircumference,
    waistCircumference,
    hipCircumference,
    guidelineCategory: resolveGuidelineCategory(baseBmi),
  };
}

export function generateBodyDataBatch(size: number): Partial<BodyData>[] {
  return Array.from({ length: size }, () => generateBodyDataSample());
}
