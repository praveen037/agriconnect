import React, { useEffect, useState } from "react";
import ExpertService from "../../services/ExpertService"; // default import
import AdminApprovalTable from "./AdminApprovalTable";

export default function AdminPendingExperts() {
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fetch = async () => {
    try {
      setLoading(true);
      const { data } = await ExpertService.getPendingExperts(); // axios returns { data }
      setExperts(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  const handleAction = async (id, action) => {
    try {
      setActionLoading(true);
      if (action === "approve") await ExpertService.approveExpert(id);
      else await ExpertService.rejectExpert(id);
      fetch();
    } finally {
      setActionLoading(false);
    }
  };

  const columns = [
    { key: "id", label: "ID", align: "center" },
    { key: "name", label: "Name", render: (e) => `${e.firstName} ${e.lastName}` },
    { key: "email", label: "Email" },
    { key: "mobileNumber", label: "Mobile" },
  ];

  if (loading) return <p>Loading pending experts...</p>;

  return <AdminApprovalTable items={experts} columns={columns} onAction={handleAction} actionLoading={actionLoading} />;
}
