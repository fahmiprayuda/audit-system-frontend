import { formatDate, formatDateTime } from "@/utils/date";
import {
  STATUS_LABEL,
  STATUS_COLOR,
} from "@/constants/findingStatus";

import {
  canManageActionPlan
} from "@/utils/auth";

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

  showApprove,
  setShowApprove,
}) {

  const currentUserId = getUser()?.id;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const target = new Date(ap.due_date);

  const isOverdue =
    ap.due_date &&
    target < today &&
    ap.status !== "approved";

  const bottomRef = useRef(null);

  useEffect(() => {

    if (expandedPlan === ap.id) {

      bottomRef.current?.scrollIntoView({
        behavior: "auto"
      });

    }

  }, [expandedPlan]);

  return (<div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-md">
    {/* HEADER */}
    <div
      onClick={() =>
        setExpandedPlan(
          expandedPlan === ap.id
            ? null
            : ap.id
        )
      }
      className="p-6 cursor-pointer hover:bg-slate-50"
    >
      <div className="flex justify-between items-center">

        <div>
          <p className="font-semibold">
            Root Cause - {ap.root_cause}
          </p>

          <p className="text-sm text-slate-500">
            Corrective Action - {ap.corrective_action}
          </p>

          <p className="text-xs text-slate-400 mt-2">
            Due: {formatDate(ap.due_date)}
          </p>
        </div>

        <div className="flex items-center gap-3">

          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUS_COLOR[ap.status]}`}
          >
            {STATUS_LABEL[ap.status]}
          </span>

          {isOverdue && (
            <span className="text-red-500 text-sm">
              ⚠ Overdue
            </span>
          )}

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
                  }`}
              >

                <div
                  className={`max-w-[70%] rounded-2xl p-4 text-sm ${isMine
                    ? "bg-blue-100"
                    : "bg-slate-100"
                    }`}
                >

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
                      className="block mt-2 p-2 text-blue-600 text-xs"
                    >
                      📎 {file.file_name}
                    </a>
                  ))}

                  <p className="text-xs text-slate-400 mt-2">
                    {formatDateTime(comment.created_at)}
                  </p>

                  <div ref={bottomRef} />

                </div>
              </div>

            );

          })}


        </div>

        {/* COMPOSER */}

        <div className="border-t p-6 space-y-4" hidden={ap.status === "approved"}>

          <textarea
            hidden={ap.status === "approved"}
            className="w-full border rounded-2xl p-4 min-h-[20px]"
            placeholder="Write message..."
            value={comments[ap.id] || ""}
            onChange={(e) =>
              setComments(prev => ({
                ...prev,
                [ap.id]: e.target.value,
              }))
            }
          />

          <div className="space-y-3">

            {files[ap.id]?.length > 0 && (
              <div className="bg-slate-50 border rounded-xl p-3 space-y-2 mb-12">

                {files[ap.id].map((file, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between text-sm"
                  >
                    <span>📎 {file.name}</span>

                    <button
                      onClick={() => {
                        setFiles(prev => ({
                          ...prev,
                          [ap.id]: prev[ap.id].filter(
                            (_, i) => i !== idx
                          )
                        }));
                      }}
                      className="text-red-500 text-xs"
                    >
                      Remove
                    </button>
                  </div>
                ))}

              </div>
            )}

            <div className="mt-8 flex justify-between items-center">

              <label className=" border px-4 py-2 rounded-xl cursor-pointer bg-white">
                📎 Attach File

                <input
                  type="file"
                  multiple
                  hidden
                  onChange={(e) => {
                    const selectedFiles =
                      Array.from(e.target.files || []);

                    setFiles(prev => ({
                      ...prev,
                      [ap.id]: [
                        ...(prev[ap.id] || []),
                        ...selectedFiles
                      ]
                    }));
                  }}
                />
              </label>

              <button
                disabled={!comments[ap.id]?.trim()}
                onClick={() => handleComment(ap.id)}
                className={`px-5 py-2 rounded-xl text-white ${comments[ap.id]?.trim()
                  ? "bg-slate-800"
                  : "bg-gray-400"
                  }`}
              >
                Send
              </button>

            </div>
          </div>

        </div>

        {/* AUDITOR ACTIONS */}

        {canManageActionPlan() && (

          <div className="border-t bg-slate-50 p-6 flex gap-3 justify-end">

            <button
              hidden={ap.status === "approved"}
              onClick={() =>
                setShowApprove(ap.id)
              }
              className="bg-blue-600 text-white px-5 py-2 rounded-xl"
            >
              Close Action Plan
            </button>

            {ap.status === "approved" && (
              <div className="mx-6 mb-4 bg-green-50 border border-green-200 rounded-xl p-3 text-sm text-green-700">
                🔒 Action Plan Closed
              </div>
            )}


          </div>


        )}
      </>
    )}

    {showApprove === ap.id && (

      <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

        <div className="bg-white rounded-2xl p-6 w-[450px]">

          <h3 className="font-semibold text-lg">
            Close Action Plan
          </h3>

          <p className="text-slate-500 mt-2">
            Are you sure you want to close this Action Plan?
          </p>

          <div className="flex justify-end gap-3 mt-6">

            <button
              onClick={() =>
                setShowApprove(null)
              }
              className="border px-4 py-2 rounded-xl"
            >
              Cancel
            </button>

            <button
              onClick={() => {

                handleAction(
                  "approve",
                  ap.id
                );

                setShowApprove(null);

              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-xl"
            >
              Submit
            </button>

          </div>

        </div>

      </div>

    )}

  </div>

  );
}