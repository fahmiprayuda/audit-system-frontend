"use client";

import { useEffect, useRef } from "react";
import { formatDate } from "@/utils/date";
import { Printer, Download, X, Shield, FileText, CheckCircle2, AlertTriangle, Building2, User, Calendar } from "lucide-react";

export default function AuditReportModal({
  isOpen,
  onClose,
  project,
  findings = [],
  summary = {},
}) {
  const reportRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !project) return null;

  const handlePrint = () => {
    window.print();
  };

  // Group findings risk breakdown
  const riskCounts = {
    high: findings.filter((f) => String(f.risk_rating).toLowerCase() === "high").length,
    medium: findings.filter((f) => String(f.risk_rating).toLowerCase() === "medium").length,
    low: findings.filter((f) => String(f.risk_rating).toLowerCase() === "low").length,
  };

  const totalFindings = findings.length;
  const companyName = project.company?.name || project.company_name || "Internal Audit Division";
  const leadAuditorName = project.creator?.name || project.lead_auditor || "Audit Team";

  return (
    <>
      {/* Print-only CSS injected */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #audit-printable-report,
          #audit-printable-report * {
            visibility: visible;
          }
          #audit-printable-report {
            position: absolute;
            left: 0;
            top: 0;
            width: 100% !important;
            margin: 0 !important;
            padding: 24px !important;
            background: #ffffff !important;
            color: #0f172a !important;
            box-shadow: none !important;
            border: none !important;
          }
          .no-print {
            display: none !important;
          }
          .page-break {
            page-break-before: always;
          }
        }
      `}</style>

      {/* Screen Modal Overlay */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-150 no-print overflow-y-auto">
        <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
          {/* Modal Header Bar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70 no-print">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Executive Audit Report Preview
                </h3>
                <p className="text-[11px] text-slate-500">
                  Dokumen laporan audit formal siap cetak atau simpan sebagai PDF
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition shadow-xs cursor-pointer"
                title="Cetak atau Simpan sebagai PDF (Ctrl/Cmd + P)"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Cetak / Simpan PDF</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Report Scrollable Body / Printable Target */}
          <div className="flex-1 overflow-y-auto p-6 sm:p-10 bg-slate-50/50">
            <div
              id="audit-printable-report"
              ref={reportRef}
              className="bg-white rounded-2xl p-8 sm:p-12 shadow-sm border border-slate-200/80 max-w-3xl mx-auto space-y-8 text-slate-900"
            >
              {/* Report Header & Letterhead */}
              <div className="border-b-2 border-slate-900 pb-6 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500">
                      <Shield className="w-4 h-4 text-slate-800" />
                      <span>Internal Audit Monitoring System</span>
                    </div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                      FORMAL AUDIT REPORT
                    </h1>
                    <p className="text-xs text-slate-600 font-medium">
                      Engagement Finding & Remediation Status Report
                    </p>
                  </div>

                  <div className="text-right space-y-1">
                    <span className="inline-block px-3 py-1 rounded-lg bg-slate-100 text-slate-800 font-mono font-bold text-xs border border-slate-200">
                      {project.project_code || "AUD-PROJ"}
                    </span>
                    <p className="text-[11px] text-slate-400">
                      Issued: {formatDate(project.release_date || new Date())}
                    </p>
                  </div>
                </div>

                {/* Metadata Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-3 border-t border-slate-100 text-xs">
                  <div>
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                      Project Name
                    </span>
                    <span className="font-bold text-slate-800 block mt-0.5">
                      {project.project_name}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                      Audited Entity
                    </span>
                    <span className="font-bold text-slate-800 block mt-0.5">
                      {companyName}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                      Audit Type
                    </span>
                    <span className="font-bold text-slate-800 block mt-0.5 capitalize">
                      {project.audit_type || "Operational Audit"}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                      Lead Auditor
                    </span>
                    <span className="font-bold text-slate-800 block mt-0.5">
                      {leadAuditorName}
                    </span>
                  </div>
                </div>
              </div>

              {/* Executive Summary & KPI Stats */}
              <div className="space-y-3">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  <span>I. Executive Summary & Metrics</span>
                </h2>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Laporan ini menyajikan hasil evaluasi audit independen serta status tindak lanjut temuan
                  terhadap pengendalian internal, kepatuhan prosedur operasional, dan mitigasi risiko unit kerja.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                    <span className="text-[10px] font-semibold text-slate-500 uppercase block">Total Temuan</span>
                    <span className="text-xl font-bold text-slate-900 mt-0.5 block">{totalFindings}</span>
                  </div>
                  <div className="p-3 bg-rose-50/70 rounded-xl border border-rose-200/70 text-center">
                    <span className="text-[10px] font-semibold text-rose-600 uppercase block">High Risk</span>
                    <span className="text-xl font-bold text-rose-700 mt-0.5 block">{riskCounts.high}</span>
                  </div>
                  <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200/70 text-center">
                    <span className="text-[10px] font-semibold text-amber-600 uppercase block">Medium Risk</span>
                    <span className="text-xl font-bold text-amber-700 mt-0.5 block">{riskCounts.medium}</span>
                  </div>
                  <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-200/70 text-center">
                    <span className="text-[10px] font-semibold text-emerald-600 uppercase block">Low Risk</span>
                    <span className="text-xl font-bold text-emerald-700 mt-0.5 block">{riskCounts.low}</span>
                  </div>
                  <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-200/70 text-center col-span-2 sm:col-span-1">
                    <span className="text-[10px] font-semibold text-blue-600 uppercase block">Closed / Solved</span>
                    <span className="text-xl font-bold text-blue-700 mt-0.5 block">{summary.closed || 0}</span>
                  </div>
                </div>
              </div>

              {/* Detailed Findings & Action Plans Table */}
              <div className="space-y-3">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  <span>II. Detail Temuan & Rencana Tindak Lanjut</span>
                </h2>

                {findings.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    Tidak ada temuan yang tercatat pada proyek audit ini.
                  </div>
                ) : (
                  <div className="overflow-hidden border border-slate-200 rounded-xl">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        <tr>
                          <th className="py-2.5 px-3 w-28">Kode Temuan</th>
                          <th className="py-2.5 px-3">Judul Temuan & Departemen</th>
                          <th className="py-2.5 px-3 w-20 text-center">Risiko</th>
                          <th className="py-2.5 px-3 w-24 text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {findings.map((f, i) => {
                          const depts = (f.departments || []).map((d) => d.name).join(", ") || "-";
                          const risk = String(f.risk_rating || "").toLowerCase();
                          return (
                            <tr key={f.id || i} className="align-top">
                              <td className="py-3 px-3 font-mono font-bold text-slate-800 text-[11px]">
                                {f.finding_code}
                              </td>
                              <td className="py-3 px-3 space-y-1">
                                <div className="font-bold text-slate-900 text-xs">{f.title}</div>
                                <div className="text-[11px] text-slate-500">
                                  <span className="font-semibold text-slate-400">Unit PIC:</span> {depts}
                                </div>
                                {f.description && (
                                  <p className="text-[11px] text-slate-600 line-clamp-2 italic">
                                    {f.description}
                                  </p>
                                )}
                              </td>
                              <td className="py-3 px-3 text-center">
                                <span
                                  className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                    risk === "high"
                                      ? "bg-rose-100 text-rose-700"
                                      : risk === "medium"
                                      ? "bg-amber-100 text-amber-700"
                                      : "bg-emerald-100 text-emerald-700"
                                  }`}
                                >
                                  {f.risk_rating || "Medium"}
                                </span>
                              </td>
                              <td className="py-3 px-3 text-center">
                                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 capitalize">
                                  {f.status ? f.status.replace(/_/g, " ") : "Open"}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Sign-off / Approval Block */}
              <div className="pt-8 border-t border-slate-200 page-break space-y-4">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  III. Lembar Pengesahan Laporan (Sign-Off)
                </h2>
                <div className="grid grid-cols-3 gap-6 pt-4 text-center text-xs">
                  <div className="space-y-16">
                    <span className="text-[11px] font-semibold text-slate-500 uppercase block">
                      Disiapkan Oleh:
                    </span>
                    <div className="border-t border-slate-300 pt-1.5">
                      <span className="font-bold text-slate-900 block">{leadAuditorName}</span>
                      <span className="text-[10px] text-slate-500 block">Lead Auditor</span>
                    </div>
                  </div>

                  <div className="space-y-16">
                    <span className="text-[11px] font-semibold text-slate-500 uppercase block">
                      Diketahui Oleh:
                    </span>
                    <div className="border-t border-slate-300 pt-1.5">
                      <span className="font-bold text-slate-900 block">Auditee Dept. Head</span>
                      <span className="text-[10px] text-slate-500 block">PIC Operasional</span>
                    </div>
                  </div>

                  <div className="space-y-16">
                    <span className="text-[11px] font-semibold text-slate-500 uppercase block">
                      Disetujui Oleh:
                    </span>
                    <div className="border-t border-slate-300 pt-1.5">
                      <span className="font-bold text-slate-900 block">Fahmi Prayuda</span>
                      <span className="text-[10px] text-slate-500 block">Head of Internal Audit</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Report Footer Note */}
              <div className="pt-4 border-t border-slate-100 text-[10px] text-slate-400 text-center">
                Dokumen ini merupakan arsip resmi Internal Audit Monitoring System. Segala informasi bersifat rahasia (Strictly Confidential).
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
