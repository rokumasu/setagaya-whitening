import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "世田谷ホワイトニング｜オンラインホームホワイトニング",
  description:
    "来院不要。歯科医師のオンライン診療を受けたうえで、自宅で使える医療用ホワイトニングジェル「Opalescence」をお届けします。",
};

// 補足：next/font/google に切り替えるとビルド時にフォントを自己ホストできて
// 表示が少し速くなるが、この開発環境からは fonts.googleapis.com へ到達できず
// 動作確認ができなかったため、Phase 0では動作確認済みの <link> 方式のままにしている。
// Vercelにデプロイした環境（外部ネットワークに問題なくアクセスできる）であれば、
// next/font/google (Zen_Old_Mincho / Zen_Kaku_Gothic_New / Fraunces) への切り替えを検討して良い。
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ja">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Zen+Old+Mincho:wght@400;500;700;900&family=Zen+Kaku+Gothic+New:wght@300;400;500;700;900&family=Fraunces:opsz,wght@9..144,340;9..144,480;9..144,600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
