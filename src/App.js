import axios from "axios";
import { useState } from "react";
import * as XLSX from "xlsx";

function App() {
  const [msg, setmsg] = useState("");
  const [status, setstatus] = useState(false);
  const [emailList, setEmailList] = useState([]);

  function handlemsg(evt) {
    setmsg(evt.target.value);
  }

  function handlefile(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function (e) {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const emailList = XLSX.utils.sheet_to_json(worksheet, { header: "A" });
      const totalemail = emailList.map((item) => item.A);
      setEmailList(totalemail);
    };
    reader.readAsBinaryString(file);
  }

  function send() {
    if (!msg || emailList.length === 0) {
      alert("⚠️ Please enter a message and upload an email list!");
      return;
    }

    setstatus(true);
    axios
      .post("https://bulkmail-backend.vercel.app/sendemail", {
        msg: msg,
        emailList: emailList,
      })
      .then(function (data) {
        if (data.data === true) {
          alert("✅ Emails Sent Successfully!");
        } else {
          alert("❌ Failed to send emails.");
        }
        setstatus(false);
      })
      .catch(() => {
        alert("⚠️ Server Error! Try again later.");
        setstatus(false);
      });
  }

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-br from-blue-950 via-blue-800 to-blue-500 text-white font-sans">
      {/* Header */}
      <header className="bg-blue-950 bg-opacity-90 text-center py-8 shadow-2xl">
        <h1 className="text-5xl font-extrabold tracking-wide drop-shadow-lg">
          📧 BulkMail Pro
        </h1>
        <p className="text-blue-200 text-base mt-3">
          Send multiple emails effortlessly — Simple, Fast, Reliable!
        </p>
      </header>

      {/* Main Section */}
      <main className="flex-grow flex items-center justify-center p-8">
        <div className="bg-white text-gray-900 rounded-3xl shadow-2xl w-full max-w-5xl p-12 transform transition-all hover:scale-[1.01]">
          <h2 className="text-center text-3xl font-semibold mb-8 text-blue-800">
            📂 Upload Email List & ✍️ Compose Message
          </h2>

          {/* Textarea */}
          <div className="mb-8">
            <textarea
              onChange={handlemsg}
              value={msg}
              className="w-full h-48 border-2 border-blue-400 rounded-xl p-4 text-lg focus:outline-none focus:ring-4 focus:ring-blue-600 transition-shadow resize-none shadow-inner"
              placeholder="Type your email message here..."
            ></textarea>
          </div>

          {/* File Upload Section */}
          <div className="flex flex-col items-center gap-4">
            <label className="border-4 border-dashed border-blue-400 rounded-2xl w-full max-w-2xl py-10 text-center cursor-pointer bg-blue-50 hover:bg-blue-100 transition-all shadow-lg hover:shadow-2xl">
              <input type="file" onChange={handlefile} className="hidden" />
              <span className="text-blue-900 font-semibold text-lg">
                📥 Click or Drag your Excel file here
              </span>
            </label>

            <p className="text-blue-700 mt-2 text-lg">
              Total Emails in file:{" "}
              <span className="font-bold text-blue-900">
                {emailList.length}
              </span>
            </p>

            {/* Send Button */}
            <button
              onClick={send}
              disabled={status}
              className={`mt-6 text-white font-semibold py-4 px-12 rounded-full shadow-lg transition-transform duration-300 ${
                status
                  ? "bg-blue-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-700 to-blue-900 hover:from-blue-800 hover:to-blue-950 hover:scale-105"
              }`}
            >
              {status ? "⏳ Sending..." : "🚀 Send Emails"}
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-blue-950 py-5 text-center text-sm text-blue-200 shadow-inner">
        © 2025 <span className="font-semibold text-white">BulkMail Pro</span> —
        Designed with 💙 by Ramya 🌸
      </footer>
    </div>
  );
}

export default App;
