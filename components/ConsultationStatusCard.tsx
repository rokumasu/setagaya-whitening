"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type DoctorState = "online" | "busy" | "offline";

type DoctorStatus = {
  state: DoctorState;
  doctor_name: string | null;
};

const STATUS_META: Record<
  DoctorState,
  {
    label: string;
    ledClass: string;
    desc: string;
    buttonLabel: string;
    buttonHref: string;
  }
> = {
  online: {
    label: "ONLINE",
    ledClass: "status-led-online",
    desc: "ただいま歯科医師がオンライン診療に対応できます。診療は5〜10分程度で終了します。",
    buttonLabel: "今すぐ診療する",
    buttonHref: "#pricing",
  },
  busy: {
    label: "BUSY",
    ledClass: "status-led-busy",
    desc: "現在、別の患者様を診療中です。次の対応時間をご確認ください。",
    buttonLabel: "次の対応時間を見る",
    buttonHref: "#flow",
  },
  offline: {
    label: "OFFLINE",
    ledClass: "status-led-offline",
    desc: "現在、即時診療は受け付けていません。主に昼休みと診療終了後の時間帯に対応しています。",
    buttonLabel: "診療を予約する",
    buttonHref: "#pricing",
  },
};

export function ConsultationStatusCard({
  initialStatus,
}: {
  initialStatus: DoctorStatus;
}) {
  const [status, setStatus] = useState<DoctorStatus>(initialStatus);

  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel("doctor_status_public")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "doctor_status",
          filter: "id=eq.1",
        },
        (payload) => {
          const next = payload.new as DoctorStatus;
          setStatus({ state: next.state, doctor_name: next.doctor_name });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const meta = STATUS_META[status.state];

  return (
    <div className="status-card">
      <div className="status-head">
        <span>Consultation Status</span>
        <span>本日の受付状況</span>
      </div>
      <div className="status-body">
        <div className="status-row">
          <span className={`status-led ${meta.ledClass}`} />
          <span className="status-label">{meta.label}</span>
        </div>
        <p className="status-desc">{meta.desc}</p>
        <a
          className="btn btn-primary btn-sm"
          href={meta.buttonHref}
          style={{ display: "flex" }}
        >
          {meta.buttonLabel}
        </a>
      </div>
      <div className="status-foot">
        <span>担当：{status.doctor_name ?? "オンライン診療歯科医師"}</span>
        <span>目安 5–10分</span>
      </div>
    </div>
  );
}
