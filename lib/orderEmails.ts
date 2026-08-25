import { createResendClient, MAIL_FROM } from "@/lib/resend";
import { formatConcentrationMix, type ConcentrationMixItem, type Plan, PLANS } from "@/lib/pricing";

type OrderEmailInput = {
  to: string;
  patientName: string;
  plan: Plan;
  concentrationMix: ConcentrationMixItem[];
  amount: number;
};

/**
 * 注文確認メール・発送連絡メールの送信に失敗しても、
 * 決済処理や発送処理そのものは失敗させたくないため、
 * ここで例外をもみ消してconsole.errorに残す（呼び出し側はawaitするだけでよい）。
 */
async function sendMailSafely(params: {
  to: string;
  subject: string;
  text: string;
}) {
  try {
    const resend = createResendClient();
    await resend.emails.send({
      from: MAIL_FROM,
      to: params.to,
      subject: params.subject,
      text: params.text,
    });
  } catch (err) {
    console.error("Failed to send email:", params.subject, err);
  }
}

export async function sendOrderConfirmationEmail({
  to,
  patientName,
  plan,
  concentrationMix,
  amount,
}: OrderEmailInput) {
  const productLine = `${PLANS[plan].label}（${formatConcentrationMix(concentrationMix)}）`;

  await sendMailSafely({
    to,
    subject: "【世田谷ホワイトニング】ご注文ありがとうございます",
    text: `${patientName} 様

この度はご注文いただき、誠にありがとうございます。
以下の内容でご注文とお支払いを承りました。

商品: ${productLine}
金額: ${amount.toLocaleString()}円（税込・送料込み）

発送準備が整い次第、改めてご連絡いたします。
今しばらくお待ちくださいませ。

世田谷ホワイトニング`,
  });
}

export async function sendShippingNotificationEmail({
  to,
  patientName,
  plan,
  concentrationMix,
}: Omit<OrderEmailInput, "amount">) {
  const productLine = `${PLANS[plan].label}（${formatConcentrationMix(concentrationMix)}）`;

  await sendMailSafely({
    to,
    subject: "【世田谷ホワイトニング】商品を発送しました",
    text: `${patientName} 様

ご注文の商品を発送いたしましたのでご連絡いたします。

商品: ${productLine}

到着まで今しばらくお待ちくださいませ。

世田谷ホワイトニング`,
  });
}
