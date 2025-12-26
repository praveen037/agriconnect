// src/components/admin/AdminApprovalTable.js
import React from "react";

export default function AdminApprovalTable({ items, columns, onAction, actionLoading }) {
  if (!items || items.length === 0) return <p>No pending items at the moment.</p>;

  return (
    <table
      style={{
        width: "100%",
        borderCollapse: "collapse",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
      }}
    >
      <thead>
        <tr style={{ backgroundColor: "#333", color: "#fff" }}>
          {columns.map((col) => (
            <th key={col.key} style={{ padding: "10px" }}>
              {col.label}
            </th>
          ))}
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr key={item.id} style={{ borderBottom: "1px solid #ddd" }}>
            {columns.map((col) => (
              <td key={col.key} style={{ padding: "8px", textAlign: col.align || "left" }}>
                {col.render ? col.render(item) : item[col.key] || "-"}
              </td>
            ))}
            <td>
              <button
                disabled={actionLoading}
                style={{
                  marginRight: "5px",
                  padding: "5px 10px",
                  backgroundColor: "green",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
                onClick={() => onAction(item.id, "approve")}
              >
                Approve
              </button>
              <button
                disabled={actionLoading}
                style={{
                  padding: "5px 10px",
                  backgroundColor: "red",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
                onClick={() => onAction(item.id, "reject")}
              >
                Reject
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
