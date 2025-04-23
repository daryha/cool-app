"use client";

import React, { useState } from "react";
import axios from "../axios";
import { saveAs } from "file-saver";
import { FileText } from "lucide-react";

export default function ExportCoachScheduleButton({ coachId }) {
  const [loading, setLoading] = useState(false);

  async function handleExport() {
    setLoading(true);
    try {
      const res = await axios.get(
        `/api/admin/coach/${coachId}/bookings/excel`,
        {
          responseType: "blob",
          headers: {
            Accept:
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          },
        }
      );
      // получаем имя файла из заголовка, если есть
      const cd = res.headers["content-disposition"];
      let filename = "schedule.xlsx";
      if (cd) {
        const m = /filename="?([^"]+)"?/.exec(cd);
        if (m && m[1]) filename = m[1];
      }
      saveAs(res.data, filename);
    } catch (err) {
      console.error(err);
      alert("Не удалось выгрузить расписание.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleExport}
      disabled={loading}
      className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
    >
      <FileText size={16} /> {loading ? "..." : "Экспорт"}
    </button>
  );
}
