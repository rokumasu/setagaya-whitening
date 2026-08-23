/**
 * 生年月日（YYYY-MM-DD）から満年齢を計算する。
 * 誕生日を迎えていない年は1歳引く。
 */
export function calculateAge(birthdate: string): number {
  const birth = new Date(birthdate);
  const today = new Date();

  let age = today.getFullYear() - birth.getFullYear();
  const hasHadBirthdayThisYear =
    today.getMonth() > birth.getMonth() ||
    (today.getMonth() === birth.getMonth() &&
      today.getDate() >= birth.getDate());

  if (!hasHadBirthdayThisYear) {
    age -= 1;
  }

  return age;
}

export const MINIMUM_AGE = 18;
