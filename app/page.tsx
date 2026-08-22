import { SignBoardDemo } from "@/components/SignBoardDemo";

export default function Home() {
  return (
    <>
      <header>
        <div className="wrap nav">
          <div className="logo">
            世田谷ホワイトニング
            <small>SETAGAYA</small>
          </div>
          <nav className="nav-links">
            <a href="#service">サービス</a>
            <a href="#flow">ご利用の流れ</a>
            <a href="#pricing">料金プラン</a>
            <a href="#faq">よくある質問</a>
          </nav>
          <div className="nav-cta">
            <a className="btn btn-primary btn-sm" href="#pricing">
              オンライン診療を予約
            </a>
          </div>
        </div>
      </header>

      <main>
        {/* ==================== HERO ==================== */}
        <section className="hero">
          <div className="wrap hero-grid">
            <div>
              <span className="eyebrow">
                Online Consultation → Home Whitening
              </span>
              <h1>
                来院せず、
                <br />
                <em>歯科医師のオンライン診療</em>
                から始める
                <br />
                ホームホワイトニング。
              </h1>
              <p className="hero-lead">
                歯科医院に通う必要はありません。オンライン診療で歯科医師が口腔内の状態を確認したうえで、医療用ホワイトニングジェル「Opalescence」をご自宅にお届けします。
              </p>
              <div className="hero-cta">
                <a className="btn btn-primary" href="#pricing">
                  オンライン診療を予約する
                </a>
                <a className="btn btn-ghost" href="#online-feature">
                  今すぐ診療できるか確認する
                </a>
              </div>
              <div className="hero-badges">
                <span>
                  <i className="dot" />
                  歯科医師によるオンライン診療付き
                </span>
                <span>
                  <i className="dot" />
                  Opalescence 正規取扱
                </span>
                <span>
                  <i className="dot" />
                  全国配送対応
                </span>
              </div>
            </div>

            <div>
              <div className="status-card">
                <div className="status-head">
                  <span>Consultation Status</span>
                  <span>本日の受付状況</span>
                </div>
                <div className="status-body">
                  <div className="status-row">
                    <span className="status-led" />
                    <span className="status-label">ONLINE</span>
                  </div>
                  <p className="status-desc">
                    ただいま歯科医師がオンライン診療に対応できます。診療は5〜10分程度で終了します。
                  </p>
                  <a
                    className="btn btn-primary btn-sm"
                    href="#pricing"
                    style={{ display: "flex" }}
                  >
                    今すぐ診療する
                  </a>
                </div>
                <div className="status-foot">
                  <span>担当：オンライン診療歯科医師</span>
                  <span>目安 5–10分</span>
                </div>
              </div>

              <div className="scale-strip">
                <div className="scale-strip-label">
                  <span>Opalescence 濃度ラインナップ</span>
                  <span>10%〜45%</span>
                </div>
                <div className="scale-bar" />
                <div className="scale-ticks">
                  <span>10%</span>
                  <span>15%</span>
                  <span>20%</span>
                  <span>35%</span>
                  <span>45%</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================== VALUES ==================== */}
        <section id="service" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <div className="values">
              <div className="value">
                <span className="vn">Consultation</span>
                <h3>通院不要、診療から購入まで完結</h3>
                <p>
                  初回はオンライン診療が必須です。歯科医師が適応を確認したうえで、購入資格が付与されます。
                </p>
              </div>
              <div className="value">
                <span className="vn">Pricing</span>
                <h3>濃度による追加料金なし</h3>
                <p>
                  10%から45%まで、すべて同一価格。高濃度をご希望の方ほどお得になる価格設計です。
                </p>
              </div>
              <div className="value">
                <span className="vn">Product</span>
                <h3>Opalescence を正規取扱</h3>
                <p>
                  歯科医療の現場で使われてきたホワイトニングジェルを、ご自宅で使用いただけます。
                </p>
              </div>
              <div className="value">
                <span className="vn">Delivery</span>
                <h3>ご自宅に直接お届け</h3>
                <p>
                  購入後、指定のご住所へ配送します。送料はお客様のご負担となります。
                </p>
              </div>
            </div>
          </div>
        </section>

        <hr className="divider" />

        {/* ==================== FLOW ==================== */}
        <section id="flow">
          <div className="wrap">
            <div className="section-head">
              <span className="eyebrow">How it works</span>
              <h2>診療から到着まで、4つのステップ。</h2>
              <p>
                一般的なECサイトのように、どなたでも直接商品を購入できる仕組みにはしていません。歯科医師の診療を起点に、必要な方へ必要な濃度をお届けします。
              </p>
            </div>

            <div className="flow">
              <div className="flow-step">
                <div className="flow-mark">1</div>
                <h3>オンライン診療を予約</h3>
                <p>
                  ビデオ通話で歯科医師の診療を受けます。1回あたり5〜10分程度です。
                </p>
                <div className="flow-meta">所要 約5–10分</div>
              </div>
              <div className="flow-step">
                <div className="flow-mark">2</div>
                <h3>口腔内の状態を確認</h3>
                <p>
                  歯科医師が画面越しに口腔内の状態を確認し、ホワイトニングの適応を判定します。
                </p>
              </div>
              <div className="flow-step">
                <div className="flow-mark">3</div>
                <h3>購入資格が付与される</h3>
                <p>
                  診療の結果、使用が可能と判断された方に、商品購入の資格が付与されます。
                </p>
              </div>
              <div className="flow-step">
                <div className="flow-mark">4</div>
                <h3>濃度・本数を選んで購入</h3>
                <p>
                  2本単位で濃度を選択し、ご自宅へ配送。決済はStripeによるクレジットカード決済です。
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ==================== ONLINE STATUS FEATURE ==================== */}
        <section id="online-feature" className="alt">
          <div className="wrap">
            <div className="board-shell">
              <div>
                <span className="eyebrow">Real-time Reception</span>
                <h2>
                  「相談したい」と思った瞬間に、
                  <br />
                  診療できるかがひと目でわかる。
                </h2>
                <p className="lead">
                  歯科医師が今オンライン対応できるかどうかを、サイト上にリアルタイムで表示します。対応可能な時間帯に、そのまま診療から購入までお進みいただけます。
                </p>
                <p className="demo-note">
                  下の3つの状態は表示イメージです。クリックすると切り替わります。
                </p>
              </div>

              <SignBoardDemo />
            </div>
          </div>
        </section>

        {/* ==================== PRODUCT ==================== */}
        <section>
          <div className="wrap product-grid">
            <div className="product-copy">
              <span className="eyebrow">The Product</span>
              <h2 style={{ fontSize: "clamp(24px,3vw,32px)", marginTop: 16 }}>
                Opalescenceを、
                <br />
                ご自宅の習慣に。
              </h2>
              <p>
                取り扱う濃度は10%・15%・20%・35%・45%の5種類。歯科医師がオンライン診療で確認した内容をもとに、無理のない濃度からお選びいただけます。
              </p>
              <p>
                Opalescenceは2本を1パックとして販売しており、1本ごとに異なる濃度を選ぶことはできません。4本セット・8本セットでは、パック単位で濃度を組み合わせることが可能です（例：20%×2本＋35%×2本）。
              </p>
              <p className="trademark-note">
                Opalescence®は米国Ultradent Products,
                Inc.の製品名です。世田谷ホワイトニングは同社と資本関係のない独立ブランドとして、正規のオンライン診療フローを通じて本製品を取り扱っています。
              </p>
            </div>

            <div className="conc-panel">
              <div className="conc-row">
                <span className="k">Concentration</span>
                <span className="v">全濃度 同一価格</span>
              </div>
              <div className="conc-scale">
                <div className="scale-bar" />
                <div className="conc-marks">
                  <div className="conc-mark">
                    <div className="pct">10%</div>
                  </div>
                  <div className="conc-mark">
                    <div className="pct">15%</div>
                  </div>
                  <div className="conc-mark">
                    <div className="pct">20%</div>
                  </div>
                  <div className="conc-mark">
                    <div className="pct">35%</div>
                  </div>
                  <div className="conc-mark">
                    <div className="pct">45%</div>
                  </div>
                </div>
              </div>
              <p className="conc-note">
                低濃度から高濃度まで、追加料金は一切かかりません。高濃度をご希望の方ほど、価格面でのメリットが大きくなります。濃度の選択は、オンライン診療での歯科医師の判断に基づきます。
              </p>
            </div>
          </div>
        </section>

        <hr className="divider" />

        {/* ==================== PRICING ==================== */}
        <section id="pricing">
          <div className="wrap">
            <div className="section-head">
              <span className="eyebrow">Pricing</span>
              <h2>本数で選ぶ、シンプルな3プラン。</h2>
              <p>
                すべて2本単位でのセット販売です。価格は濃度にかかわらず一律。送料は別途お客様のご負担となります。
              </p>
            </div>

            <div className="pricing-grid">
              <div className="plan">
                <span className="plan-tag">Trial</span>
                <div className="plan-name">2本セット</div>
                <div className="plan-units">濃度1種類を選択 ／ お試し向け</div>
                <div className="plan-price">
                  <span className="num">3,980</span>
                  <span className="yen">円</span>
                </div>
                <div className="plan-tax">税込・送料別</div>
                <ul className="plan-feats">
                  <li>初めての方のお試しに</li>
                  <li>濃度は10〜45%から1種類</li>
                  <li>オンライン診療1回込み</li>
                </ul>
                <a className="btn btn-ghost" href="#">
                  このプランで診療を予約
                </a>
              </div>

              <div className="plan is-reco">
                <span className="plan-tag">Recommended</span>
                <div className="plan-name">4本セット</div>
                <div className="plan-units">2パックまで濃度を組み合わせ可能</div>
                <div className="plan-price">
                  <span className="num">6,980</span>
                  <span className="yen">円</span>
                </div>
                <div className="plan-tax">税込・送料別</div>
                <ul className="plan-feats">
                  <li>最も選ばれている本数</li>
                  <li>例：20%×2本＋35%×2本</li>
                  <li>オンライン診療1回込み</li>
                </ul>
                <a className="btn btn-primary" href="#">
                  このプランで診療を予約
                </a>
              </div>

              <div className="plan">
                <span className="plan-tag">Best Value</span>
                <div className="plan-name">8本セット</div>
                <div className="plan-units">4パックまで濃度を組み合わせ可能</div>
                <div className="plan-price">
                  <span className="num">13,480</span>
                  <span className="yen">円</span>
                </div>
                <div className="plan-tax">税込・送料別</div>
                <ul className="plan-feats">
                  <li>1本あたりの単価が最も低い</li>
                  <li>ホワイトニング歯磨き粉 1本プレゼント</li>
                  <li>オンライン診療1回込み</li>
                </ul>
                <a className="btn btn-ghost" href="#">
                  このプランで診療を予約
                </a>
              </div>
            </div>

            <div className="pricing-foot">
              <span>
                ※ すべてのプランに、購入前のオンライン診療（歯科医師）が含まれます。
              </span>
              <span>
                ※
                濃度の組み合わせは2本単位です。1本ごとに異なる濃度を選ぶことはできません。
              </span>
            </div>
          </div>
        </section>

        {/* ==================== TRUST ==================== */}
        <section className="alt">
          <div className="wrap">
            <div className="section-head">
              <span className="eyebrow">Safety &amp; Compliance</span>
              <h2>安心してお使いいただくために。</h2>
            </div>

            <div className="trust-list">
              <div className="trust-item">
                <h3>診療を起点にした販売</h3>
                <p>
                  本サービスは自由診療です。オンライン診療を受けていない方が商品のみを購入することはできません。歯科医師が適応を確認したうえで、購入資格を付与します。
                </p>
              </div>
              <div className="trust-item">
                <h3>個人情報の最小限管理</h3>
                <p>
                  詳細な診療情報（既往歴・診断内容・処方内容など）は診療側で厳重に管理し、購入サイトには保存しません。購入サイトが保持するのは、氏名・配送先など購入手続きに必要な最小限の情報です。
                </p>
              </div>
              <div className="trust-item">
                <h3>決済とカード情報</h3>
                <p>
                  決済にはStripeを利用し、カード番号は当社サーバーには保存されません。特定の決済事業者にシステム全体を依存しない構成としています。
                </p>
              </div>
              <div className="trust-item">
                <h3>効果とリスクについて</h3>
                <p>
                  ホワイトニングの効果には個人差があります。知覚過敏など、まれに一時的な症状が生じる場合があります。詳しい注意事項はオンライン診療時に歯科医師よりご説明します。
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ==================== FAQ ==================== */}
        <section id="faq">
          <div className="wrap">
            <div className="section-head">
              <span className="eyebrow">FAQ</span>
              <h2>よくあるご質問</h2>
            </div>

            <div className="faq-list">
              <details className="faq-item">
                <summary>歯科医院に通院する必要はありますか？</summary>
                <p className="faq-a">
                  通院の必要はありません。オンライン診療で歯科医師が口腔内の状態を確認し、適応が確認できた方に商品購入の資格を付与します。
                </p>
              </details>
              <details className="faq-item">
                <summary>診療にはどのくらい時間がかかりますか？</summary>
                <p className="faq-a">
                  1回あたり5〜10分程度を想定しています。ビデオ通話で口腔内を確認し、その場で適応の判定を行います。
                </p>
              </details>
              <details className="faq-item">
                <summary>濃度はどのように選べばよいですか？</summary>
                <p className="faq-a">
                  初めての方は低めの濃度から始めることが多いですが、最終的にはオンライン診療の中で歯科医師と相談のうえで決定します。10〜45%のいずれも追加料金はかかりません。
                </p>
              </details>
              <details className="faq-item">
                <summary>
                  4本セット・8本セットで濃度を混ぜることはできますか？
                </summary>
                <p className="faq-a">
                  2本単位であれば可能です。4本セットは2パックまで、8本セットは4パックまで、濃度の異なる組み合わせをお選びいただけます（例：10%×2本＋45%×2本）。1本ごとに異なる濃度を指定することはできません。
                </p>
              </details>
              <details className="faq-item">
                <summary>支払い方法を教えてください。</summary>
                <p className="faq-a">
                  クレジットカード決済（Stripe）に対応しています。カード情報は当社では保存せず、決済代行会社側で安全に管理されます。
                </p>
              </details>
              <details className="faq-item">
                <summary>送料はかかりますか？</summary>
                <p className="faq-a">
                  送料はお客様のご負担となります。購入手続きの際に金額を明示いたします。
                </p>
              </details>
            </div>
          </div>
        </section>

        {/* ==================== FINAL CTA ==================== */}
        <section>
          <div className="wrap">
            <div className="cta-band">
              <span className="eyebrow">Start Today</span>
              <h2>まずはオンライン診療から。</h2>
              <p>
                診療は5〜10分程度。歯科医師が適応を確認したうえで、あなたに合った濃度のOpalescenceをご自宅にお届けします。
              </p>
              <div className="cta-band-row">
                <a className="btn btn-onlight" href="#pricing">
                  オンライン診療を予約する
                </a>
                <a
                  className="btn btn-ghost"
                  style={{
                    borderColor: "var(--panel-line-strong)",
                    color: "var(--panel-text)",
                  }}
                  href="#online-feature"
                >
                  受付状況を確認する
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div className="wrap">
          <div className="foot-grid">
            <div className="foot-brand">
              <div className="logo">
                世田谷ホワイトニング
                <small>SETAGAYA</small>
              </div>
              <p>
                オンライン診療から始める、ホームホワイトニング専門ブランド。既存の歯科医院とは独立して運営しています。
              </p>
            </div>
            <div className="foot-col">
              <h4>Service</h4>
              <ul>
                <li>
                  <a href="#service">サービスについて</a>
                </li>
                <li>
                  <a href="#flow">ご利用の流れ</a>
                </li>
                <li>
                  <a href="#pricing">料金プラン</a>
                </li>
              </ul>
            </div>
            <div className="foot-col">
              <h4>Support</h4>
              <ul>
                <li>
                  <a href="#faq">よくある質問</a>
                </li>
                <li>
                  <a href="#">お問い合わせ</a>
                </li>
                <li>
                  <a href="#">配送について</a>
                </li>
              </ul>
            </div>
            <div className="foot-col">
              <h4>Legal</h4>
              <ul>
                <li>
                  <a href="#">運営会社</a>
                </li>
                <li>
                  <a href="#">特定商取引法に基づく表記</a>
                </li>
                <li>
                  <a href="#">プライバシーポリシー</a>
                </li>
              </ul>
            </div>
          </div>

          <div className="foot-legal">
            <p>
              本サービスで提供するホームホワイトニングは自由診療であり、公的医療保険の適用対象外です。効果・期間には個人差があります。掲載価格はすべて税込です（送料別）。オンライン診療の結果、適応外と判断される場合があります。
            </p>
            <p>
              Opalescence®は米国Ultradent Products,
              Inc.の製品名であり、世田谷ホワイトニングは同社とは資本関係のない独立した事業者です。
            </p>
          </div>

          <div className="foot-bottom">
            <span>© 2026 世田谷ホワイトニング. All rights reserved.</span>
            <span>本ページはサービス紹介を目的としたモックアップです。</span>
          </div>
        </div>
      </footer>
    </>
  );
}
