"use client";

import { useState } from "react";

export default function DevPage() {
  const [response, setResponse] = useState("");

  async function createPeriod() {
    const res = await fetch("/api/historical-periods", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "Medieval India",
        startYear: "550 CE",
        endYear: "1526 CE",
        description: "Period after Ancient India.",
        status: "Draft",
      }),
    });

    setResponse(
      JSON.stringify(await res.json(), null, 2)
    );
  }

  async function getAll() {
    const res = await fetch(
      "/api/historical-periods"
    );

    setResponse(
      JSON.stringify(await res.json(), null, 2)
    );
  }

  async function getOne() {
    const res = await fetch(
      "/api/historical-periods/PER0001"
    );

    setResponse(
      JSON.stringify(await res.json(), null, 2)
    );
  }

  async function updateOne() {
    const res = await fetch(
      "/api/historical-periods/PER0001",
      {
        method: "PATCH",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          significance:
            "Updated through Developer Dashboard.",
        }),
      }
    );

    setResponse(
      JSON.stringify(await res.json(), null, 2)
    );
  }

  async function deleteOne() {
    const res = await fetch(
        "/api/historical-periods/PER0001",
        {
        method: "DELETE",
        }
    );

    setResponse(
        JSON.stringify(await res.json(), null, 2)
    );
    }

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Developer Dashboard</h1>

      <div
        style={{
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
          marginTop: "20px",
        }}
      >
        <button onClick={createPeriod}>
          Create
        </button>

        <button onClick={getAll}>
          Get All
        </button>

        <button onClick={getOne}>
          Get One
        </button>

        <button onClick={updateOne}>
          Update
        </button>

        <button onClick={deleteOne}>
            Delete
        </button>
      </div>

      <pre
        style={{
          marginTop: "20px",
          padding: "20px",
          background: "#111",
          color: "#00ff66",
          borderRadius: "8px",
          overflow: "auto",
        }}
      >
        {response}
      </pre>
    </main>
  );
}