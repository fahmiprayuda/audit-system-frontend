import { formatDate, formatDateTime } from "@/utils/date";
import {
  STATUS_LABEL,
  STATUS_COLOR,
  FLAG_LABEL,
  FLAG_COLOR
} from "@/constants/findingStatus";

import { canManageActionPlan } from "@/utils/auth";
import { useRef, useEffect } from "react";
import { getUser } from "@/utils/auth";

export default function ActionPlanCard({
  ap,

  expandedPlan,
  setExpandedPlan,

  comments,
  setComments,

  files,
  setFiles,

  handleComment,
  handleAction,

  workflowAction,
  setWorkflowAction,

  showApprove,
  setShowApprove,

  showExtend,
  setShowExtend,
  extensionData,
  setExtensionData,
  handleExtend,
}) {

  const isSiteValidation =
    ap.primary_flag === "on_site_validation";

  const currentUserId = getUser()?.id;

  const isAuditor = canManageActionPlan();
  const canShowWorkflowCheckbox = () => {

    if (ap.status === "closed") {
      return false;
    }

    if (isAuditor) {
      return true;
    }

    return ["new", "revision"].includes(ap.queue);

  };

  const bottomRef = useRef(null);

  useEffect(() => {
    if (expandedPlan === ap.id) {
      bottomRef.current?.scrollIntoView({
        behavior: "auto"
      });
    }
  }, [expandedPlan]);

  return (
    <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-md">
      <div
        onClick={() =>
          setExpandedPlan(
            expandedPlan === ap.id
              ? null
              : ap.id
          )
        }
        className="p-6 cursor-pointer hover:bg-slate-50">

        <div className="flex justify-between items-center">
          <div>
            <p className="font-semibold">Root Cause - {ap.root_cause}</p>
            <p className="text-sm text-slate-500">Corrective Action - {ap.corrective_action}</p>
            <p className="text-xs text-slate-400 mt-2">Due: {formatDate(ap.due_date)}</p>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUS_COLOR[ap.status]}`}>
              {STATUS_LABEL[ap.status]}
            </span>

            <div className="flex gap-2 flex-wrap">
              {(ap.flags || []).map(flag => (
                <span
                  key={flag}
                  className={`px-2 py-1 rounded-full text-xs font-medium ${FLAG_COLOR[flag] || "bg-gray-100 text-gray-700"
                    }`}>
                  {FLAG_LABEL[flag]}
                </span>
              ))}
            </div>

          </div>
        </div>

      </div>

      {expandedPlan === ap.id && (
        <>
          {/* CHAT HISTORY */}
          <div className="bg-slate-50 p-6 space-y-4 max-h-[500px] overflow-y-auto ">
            {(ap.comments || []).map(comment => {
              console.log(comment);
              console.log(
                "comment.user_id",
                comment.user_id
              );
              const isMine =
                comment.user_id === currentUserId;

              return (
                <div
                  key={comment.id}
                  className={`flex ${isMine
                    ? "justify-end"
                    : "justify-start"
                    }`}>

                  <div
                    className={`max-w-[70%] rounded-2xl p-4 text-sm ${isMine
                      ? "bg-blue-100"
                      : "bg-slate-100"
                      }`}>

                    <div className="font-semibold text-xs mb-1">
                      {isMine
                        ? "You"
                        : comment.user_name}
                    </div>

                    <p>{comment.message}</p>

                    {comment.attachments?.map(file => (
                      <a
                        key={file.id}
                        href={`http://localhost:8000/storage/${file.file_path}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block mt-2 p-2 text-blue-600 text-xs">
                        📎 {file.file_name}
                      </a>
                    ))}

                    <p className="text-xs text-slate-400 mt-2">{formatDateTime(comment.created_at)}</p>

                    <div ref={bottomRef} />

                  </div>
                </div>
              );
            })}
          </div>

          {/* COMPOSER */}

          <div
            className="border-t p-6 space-y-6"
            hidden={ap.status === "closed"}
          >
            {/* Message */}
            <textarea
              className="w-full border rounded-2xl p-4 min-h-[100px]"
              placeholder="Write message..."
              value={comments[ap.id] || ""}
              onChange={(e) =>
                setComments((prev) => ({
                  ...prev,
                  [ap.id]: e.target.value,
                }))
              }
            />

            {/* Selected Files */}
            {files[ap.id]?.length > 0 && (
              <div className="bg-slate-50 border rounded-xl p-3 space-y-2">
                {files[ap.id].map((file, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between text-sm"
                  >
                    <span>📎 {file.name}</span>

                    <button
                      type="button"
                      onClick={() => {
                        setFiles((prev) => ({
                          ...prev,
                          [ap.id]: prev[ap.id].filter((_, i) => i !== idx),
                        }));
                      }}
                      className="text-red-500 hover:text-red-600"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Workflow */}
            {canShowWorkflowCheckbox() && (
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    id={`workflow-${ap.id}`}
                    type="checkbox"
                    checked={!!workflowAction[ap.id]}
                    onChange={(e) =>
                      setWorkflowAction((prev) => ({
                        ...prev,
                        [ap.id]: e.target.checked
                          ? canManageActionPlan()
                            ? "revision_required"
                            : "submitted"
                          : "",
                      }))
                    }
                    className="w-4 h-4 rounded border-slate-300"
                  />

                  <label htmlFor={`workflow-${ap.id}`}>

                    {canManageActionPlan()
                      ? (
                        isSiteValidation
                          ? " Validation Failed (Request Revision)"
                          : " Request Revision"
                      )
                      : " Submit for Review"}

                  </label>
                </div>

                {workflowAction[ap.id] && (
                  <p className="text-xs text-blue-600">
                    This message will also update the workflow status.
                  </p>
                )}
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between pt-2">
              <label className="border px-4 py-2 rounded-xl cursor-pointer bg-white hover:bg-slate-50 transition">
                📎 Attach File

                <input
                  type="file"
                  multiple
                  hidden
                  onChange={(e) => {
                    const selectedFiles = Array.from(
                      e.target.files || []
                    );

                    setFiles((prev) => ({
                      ...prev,
                      [ap.id]: [
                        ...(prev[ap.id] || []),
                        ...selectedFiles,
                      ],
                    }));
                  }}
                />
              </label>

              <button
                disabled={!comments[ap.id]?.trim()}
                onClick={() =>
                  handleComment(
                    ap.id,
                    workflowAction[ap.id]
                  )
                }
                className={`px-6 py-2.5 rounded-xl font-medium text-white transition ${comments[ap.id]?.trim()
                  ? "bg-slate-900 hover:bg-slate-800"
                  : "bg-slate-300 cursor-not-allowed"
                  }`}
              >
                Send
              </button>
            </div>
          </div>


          {/* AUDITOR ACTIONS */}
          {
            canManageActionPlan() && (
              <div className="border-t bg-slate-50 p-6 flex gap-3 justify-center">
                <button
                  hidden={ap.status === "closed"}
                  onClick={() => setShowExtend(ap.id)}
                  className="bg-amber-500 text-white px-5 py-2 rounded-xl"
                >
                  Extend Due Date
                </button>

                <button
                  hidden={ap.status === "closed"}
                  onClick={() =>
                    setShowApprove(ap.id)
                  }
                  className="bg-blue-600 text-white px-5 py-2 rounded-xl">
                  Close Action Plan
                </button>

                {ap.status === "closed" && (
                  <div className="mx-6 mb-4 bg-green-50 border border-green-200 rounded-xl p-3 text-lg text-green-700">
                    🔒 Action Plan Closed
                  </div>
                )}


              </div>


            )
          }
        </>
      )
      }

      {
        showApprove === ap.id && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
            <div className="bg-white rounded-2xl p-6 w-[450px]">
              <h3 className="font-semibold text-lg">Close Action Plan</h3>
              <p className="text-slate-500 mt-2">Are you sure you want to close this Action Plan?</p>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() =>
                    setShowApprove(null)
                  }
                  className="border px-4 py-2 rounded-xl">
                  Cancel
                </button>
                <button
                  onClick={() => {
                    handleAction(
                      "close",
                      ap.id
                    );

                    setShowApprove(null);
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-xl">
                  Submit
                </button>
              </div>
            </div>
          </div>
        )
      }

      {/* Modal Extend Due Date */}
      {
        showExtend === ap.id && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

            <div className="bg-white rounded-2xl p-6 w-[600px]">

              <h3 className="text-lg font-semibold">
                Extend Action Plan
              </h3>

              <div className="space-y-4 mt-4">

                <div>
                  <label className="text-sm font-medium">
                    New Due Date
                  </label>

                  <input
                    type="date"
                    className="w-full border rounded-xl p-3 mt-1"
                    value={extensionData.new_due_date}
                    onChange={(e) =>
                      setExtensionData(prev => ({
                        ...prev,
                        new_due_date: e.target.value
                      }))
                    }
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">
                    Status After Extension
                  </label>

                  <select
                    className="w-full border rounded-xl p-3 mt-1"
                    value={extensionData.status_after_extension}
                    onChange={(e) =>
                      setExtensionData(prev => ({
                        ...prev,
                        status_after_extension:
                          e.target.value
                      }))
                    }
                  >
                    <option value="open">
                      Open
                    </option>

                    <option value="need_further_review">
                      Need Further Review
                    </option>

                    <option value="closed">
                      Closed
                    </option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium">
                    Reason
                  </label>

                  <textarea
                    className="w-full border rounded-xl p-3 min-h-[120px] mt-1"
                    value={extensionData.reason}
                    onChange={(e) =>
                      setExtensionData(prev => ({
                        ...prev,
                        reason: e.target.value
                      }))
                    }
                  />
                </div>

              </div>

              <div className="flex justify-end gap-3 mt-6">

                <button
                  onClick={() =>
                    setShowExtend(null)
                  }
                  className="border px-4 py-2 rounded-xl"
                >
                  Cancel
                </button>

                <button
                  onClick={() =>
                    handleExtend(ap.id)
                  }
                  className="bg-blue-600 text-white px-4 py-2 rounded-xl"
                >
                  Save Extension
                </button>

              </div>

            </div>

          </div>
        )
      }

    </div >
  );
}