"use client";

import { useState } from "react";
import axios from "axios";

export default function ContactForm() {
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [result, setResult] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(false);

  const sendEmail = () => {
    setLoading(true);
    axios
      .post("/api/sendEmail", {
        clientName,
        clientEmail,
      })
      .then((response) => setResult(response.data))
      .catch((error) => setResult({ error: error.message }))
      .finally(() => setLoading(false));
  };

  return (
    <div>
      {loading && <h1>Loading</h1>}
      <input
        type="text"
        value={clientName}
        onChange={(e) => setClientName(e.target.value)}
        placeholder="Enter your name"
      />
      <input
        type="email"
        value={clientEmail}
        onChange={(e) => setClientEmail(e.target.value)}
        placeholder="Enter your email"
        />
      <button onClick={sendEmail}>Send Email</button>
      {result && <div>{JSON.stringify(result)}</div>}
    </div>
  );
}
