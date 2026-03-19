const dummyFindings = [
  {
    id: 1,
    title: "Stock bahan baku tidak sesuai sistem",
    risk_level: "High",
    status: "open",
    due_date: "2026-04-01",
    departments: [
      { id: 1, name: "Warehouse" },
      { id: 2, name: "Production" }
    ]
  },
  {
    id: 2,
    title: "Proses approval pembelian tidak sesuai SOP",
    risk_level: "Medium",
    status: "need_review",
    due_date: "2026-04-10",
    departments: [
      { id: 3, name: "Finance" }
    ]
  },
  {
    id: 3,
    title: "Dokumentasi QC tidak lengkap",
    risk_level: "Low",
    status: "closed",
    due_date: "2026-03-15",
    departments: [
      { id: 4, name: "Quality Control" }
    ]
  }
];

export default dummyFindings;