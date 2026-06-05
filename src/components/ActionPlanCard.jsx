import { formatDate, formatDateTime } from "@/utils/date";
import {
  STATUS_FLOW,
  STATUS_LABEL,
  STATUS_COLOR,
  CURRENT_OWNER,
} from "@/constants/findingStatus";
import { getUser, canManageActionPlan, isAuditee } from "@/utils/auth";



export default function ActionPlanCard({ ap,
  expandedPlan,
  setExpandedPlan,
  comments,
  setComments,
  rejectComments,
  setRejectComments,
  files,
  setFiles,
  handleSubmit,
  handleAction,
  handleSubmitRevision,
  showReject,
  setShowReject, }) {

  const user = getUser();

  const actions = STATUS_FLOW[ap.status] || [];

  const isMyTurn =
    CURRENT_OWNER[ap.status] === user?.role;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const target = new Date(ap.target_date);

  const isOverdue =
    ap.target_date &&
    target < today &&
    ap.status !== "approved";

  return (
    <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-md hover:shadow-lg transition-all">

      {/* HEADER */}
      <div
        onClick={() =>
          setExpandedPlan(
            expandedPlan === ap.id ? null : ap.id
          )
        }
        className="p-6 border-b border-slate-200 cursor-pointer hover:bg-slate-50 transition"
      >
        <div className="flex justify-between items-center">

          <div>
            <p className="font-semibold text-slate-800">
              Root Cause - {ap.root_cause}
            </p>

            <p className="text-sm text-slate-500 mt-1">
              Corrective Action - {ap.corrective_action}
            </p>

            <p className="text-xs text-slate-400 mt-2">
              Due: {formatDate(ap.target_date)}
            </p>

          </div>

          <div className="flex items-center gap-3">

            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUS_COLOR[ap.status]}`}
            >
              {STATUS_LABEL[ap.status]}
            </span>

            {isOverdue && (
              <span className="text-red-500 text-sm font-semibold">
                ⚠ Overdue
              </span>
            )}

            <span className="text-slate-400 text-xl">
              {expandedPlan === ap.id ? "−" : "+"}
            </span>
          </div>
        </div>

      </div>

      {expandedPlan === ap.id && (
        <>
          {/* 💬 CHAT BOX */}
          {ap.comments?.length > 0 && (
            <div className="bg-slate-50 px-6 py-8 space-y-6 max-h-[420px] overflow-y-auto scrollbar-thin scrollbar-thumb-blue-200 hover:scrollbar-thumb-blue-300">
              {(ap.comments || []).map((c, i) => (
                <div
                  key={i}
                  className={`max-w-[55%] p-4 rounded-2xl text-sm ${c.role === "auditor"
                    ? "bg-orange-100"
                    : "bg-blue-100 ml-auto"
                    }`}
                >
                  <p className="font-semibold text-xs mb-1">
                    {c.role}
                  </p>

                  <p>{c.message}</p>

                  {c.evidences?.map(file => (
                    <a
                      key={file.id}
                      href={`http://localhost:8000/storage/${file.file_path}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block mt-3 text-blue-600 text-xs border-t pt-2"
                    >
                      📎 {file.file_name}
                    </a>
                  ))}

                  <p className="text-xs text-slate-400 mt-2">
                    {formatDateTime(c.created_at)}
                  </p>
                </div>
              ))}
            </div>
          )}


          {/* ❌ REVISION FORM */}
          {showReject === ap.id && (
            <div className="p-6 border-t border-slate-200 bg-orange-50">
              <p className="text-sm text-slate-500 mb-3">
                Revision Comment
              </p>

              <textarea
                className="w-full border border-slate-300 rounded-2xl p-4 min-h-[120px]"
                placeholder="Explain what needs to be revised..."
                value={rejectComments[ap.id] || ""}
                onChange={(e) =>
                  setRejectComments(prev => ({
                    ...prev,
                    [ap.id]: e.target.value
                  }))
                }
              />

              <div className="mt-4 flex justify-end">
                <button
                  disabled={!rejectComments[ap.id]?.trim()}
                  onClick={() => handleSubmitRevision(ap)}
                  className={`px-6 py-3 rounded-2xl text-white ${rejectComments[ap.id]?.trim()
                    ? "bg-orange-600 hover:bg-orange-700"
                    : "bg-gray-400 cursor-not-allowed"
                    }`}
                >
                  Submit Revision
                </button>
              </div>
            </div>
          )}

          {/* AUDITEE COMMENT BOX */}
          {isMyTurn && ["draft", "need_revision"].includes(ap.status) && (
            <div className="p-6 border-t border-slate-200">
              <p className="text-sm text-slate-500 mb-3">
                Add Comment / Response
              </p>

              <textarea
                className="w-full border border-slate-300 rounded-2xl p-4 min-h-[120px]"
                placeholder="Type your response here..."
                value={comments[ap.id] || ""}
                onChange={(e) =>
                  setComments(prev => ({
                    ...prev,
                    [ap.id]: e.target.value
                  }))
                }
              />
            </div>
          )}


          {/* FILE UPLOAD BOX */}
          {files[ap.id]?.length > 0 && (
            <div className="bg-slate-20 border p-4 text-left">
              <p className="text-sm font-medium mb-3">
                Selected Files ({files[ap.id].length})
              </p>

              <div className="space-y-2">
                {files[ap.id].map((file, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between bg-white px-3 py-2 rounded-xl border text-sm"
                  >
                    <span>📎 {file.name}</span>
                    <span className="text-slate-400">
                      {(file.size / 1024).toFixed(1)} KB
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ACTION BUTTONS */}
          <div className="flex justify-between items-start p-6 border-t border-slate-200 bg-slate-50">
            <div className="flex gap-3">

              {isMyTurn && actions.includes("submit") && (
                <button
                  onClick={() => handleSubmit(ap)}
                  disabled={!comments[ap.id]?.trim()}
                  className={`px-6 py-3 rounded-2xl text-white ${comments[ap.id]?.trim()
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-gray-400 cursor-not-allowed"
                    }`}
                >
                  Submit
                </button>
              )}

              {canManageActionPlan() && isMyTurn && actions.includes("approve") && (
                <button
                  onClick={() => handleAction("approve", ap.id)}
                  className="bg-blue-500 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl"
                >
                  Approve
                </button>
              )}

              {isMyTurn && actions.includes("revision") && (
                <button
                  onClick={() =>
                    setShowReject(showReject === ap.id ? null : ap.id)
                  }
                  className="bg-pink-500 hover:bg-pink-700 text-white px-6 py-3 rounded-2xl"
                >
                  Revision
                </button>
              )}

            </div>


            {/* RIGHT = EVIDENCE */}
            <div className="w-full max-w-md space-y-4 text-right">

              {isAuditee() && isMyTurn && actions.includes("submit") && (
                <>
                  <label className="inline-flex items-center gap-2 border px-5 py-3 rounded-2xl cursor-pointer bg-white hover:bg-slate-50">
                    📎 Upload Evidence
                    <input
                      type="file"
                      multiple
                      hidden
                      onChange={(e) => {
                        const selectedFiles = Array.from(e.target.files || []);

                        setFiles(prev => ({
                          ...prev,
                          [ap.id]: selectedFiles
                        }));
                      }}
                    />
                  </label>
                </>
              )}

              {ap.evidences?.length > 0 && (
                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 text-left">
                  <p className="text-sm font-medium text-slate-700 mb-3">
                    Uploaded Evidence
                  </p>

                  <div className="space-y-2">
                    {ap.evidences.map(file => (
                      <a
                        key={file.id}
                        href={`http://localhost:8000/storage/${file.file_path}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block bg-white px-3 py-2 rounded-xl border text-sm hover:bg-slate-50"
                      >
                        📎 {file.file_name}
                      </a>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        </>
      )}

    </div>
  );
}