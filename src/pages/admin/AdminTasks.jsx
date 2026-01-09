import React, { useState } from "react";
import { TASKS, EMPLOYEES } from "../../data/mockData";

export default function AdminTasks() {
  const [tasks, setTasks] = useState(TASKS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // State cho form tạo mới
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    deadline: "",
    priority: "Medium",
    assigneeIds: [], // Mảng chứa ID nhân viên được chọn
  });

  // Helper: Lấy tên nhân viên từ mảng ID
  const getAssigneeNames = (ids) => {
    return ids
      .map((id) => EMPLOYEES.find((e) => e.id === id)?.name)
      .filter(Boolean)
      .join(", ");
  };

  const handleCreateTask = (e) => {
    e.preventDefault();
    if (newTask.assigneeIds.length === 0) {
      alert("Vui lòng chọn ít nhất 1 nhân viên!");
      return;
    }
    const task = {
      ...newTask,
      id: Date.now(),
      status: "To Do",
    };
    setTasks([...tasks, task]);
    setIsModalOpen(false);
    setNewTask({ title: "", description: "", deadline: "", priority: "Medium", assigneeIds: [] });
  };

  const handleDelete = (id) => {
    if (window.confirm("Xóa công việc này?")) {
      setTasks(tasks.filter((t) => t.id !== id));
    }
  };

  const toggleAssignee = (empId) => {
    setNewTask((prev) => {
      const isSelected = prev.assigneeIds.includes(empId);
      if (isSelected) {
        return { ...prev, assigneeIds: prev.assigneeIds.filter((id) => id !== empId) };
      } else {
        return { ...prev, assigneeIds: [...prev.assigneeIds, empId] };
      }
    });
  };

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
        <h2>Quản lý Giao việc (Tasks)</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          style={{ background: "#007bff", color: "white", padding: "10px 20px", border: "none", cursor: "pointer", borderRadius: 4 }}
        >
          + Tạo việc mới
        </button>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid #ddd" }}>
        <thead>
          <tr style={{ background: "#f4f4f4", textAlign: "left" }}>
            <th style={{ padding: 10 }}>Công việc</th>
            <th style={{ padding: 10 }}>Người thực hiện</th>
            <th style={{ padding: 10 }}>Deadline</th>
            <th style={{ padding: 10 }}>Độ ưu tiên</th>
            <th style={{ padding: 10 }}>Trạng thái</th>
            <th style={{ padding: 10 }}>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id} style={{ borderBottom: "1px solid #eee" }}>
              <td style={{ padding: 10 }}>
                <strong>{task.title}</strong>
                <div style={{ fontSize: 12, color: "gray" }}>{task.description}</div>
              </td>
              <td style={{ padding: 10 }}>{getAssigneeNames(task.assigneeIds)}</td>
              <td style={{ padding: 10 }}>{task.deadline}</td>
              <td style={{ padding: 10 }}>
                <span style={{
                  padding: "4px 8px", borderRadius: 4, fontSize: 12, color: "white",
                  background: task.priority === "High" ? "#dc3545" : task.priority === "Medium" ? "#ffc107" : "#28a745"
                }}>
                  {task.priority}
                </span>
              </td>
              <td style={{ padding: 10 }}>{task.status}</td>
              <td style={{ padding: 10 }}>
                <button onClick={() => handleDelete(task.id)} style={{ color: "red", border: "none", background: "none", cursor: "pointer" }}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* MODAL TẠO TASK */}
      {isModalOpen && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center"
        }}>
          <div style={{ background: "white", padding: 20, borderRadius: 8, width: 500, maxWidth: "90%" }}>
            <h3>Giao việc mới</h3>
            <form onSubmit={handleCreateTask} style={{ display: "grid", gap: 10 }}>
              <label>Tiêu đề: <input required style={{ width: "100%", padding: 5 }} value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})} /></label>
              <label>Mô tả: <textarea style={{ width: "100%", padding: 5 }} value={newTask.description} onChange={e => setNewTask({...newTask, description: e.target.value})} /></label>
              
              <div style={{ display: "flex", gap: 10 }}>
                <label style={{ flex: 1 }}>Deadline: <input type="date" required style={{ width: "100%", padding: 5 }} value={newTask.deadline} onChange={e => setNewTask({...newTask, deadline: e.target.value})} /></label>
                <label style={{ flex: 1 }}>Ưu tiên: 
                  <select style={{ width: "100%", padding: 5 }} value={newTask.priority} onChange={e => setNewTask({...newTask, priority: e.target.value})}>
                    <option value="Low">Thấp</option>
                    <option value="Medium">Vừa</option>
                    <option value="High">Cao</option>
                  </select>
                </label>
              </div>

              {/* Multi-select nhân viên */}
              <div>
                <label>Giao cho ai:</label>
                <div style={{ maxHeight: 100, overflowY: "auto", border: "1px solid #ccc", padding: 5, marginTop: 5 }}>
                  {EMPLOYEES.map(emp => (
                    <div key={emp.id} style={{ marginBottom: 5 }}>
                      <label style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
                        <input
                          type="checkbox"
                          checked={newTask.assigneeIds.includes(emp.id)}
                          onChange={() => toggleAssignee(emp.id)}
                          style={{ marginRight: 8 }}
                        />
                        {emp.name} ({emp.department})
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ marginTop: 10, display: "flex", justifyContent: "flex-end", gap: 10 }}>
                <button type="button" onClick={() => setIsModalOpen(false)}>Hủy</button>
                <button type="submit" style={{ background: "#007bff", color: "white", border: "none", padding: "8px 16px" }}>Giao việc</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}