"use client";

import { useState } from "react";

export default function DevPage() {
  const [response, setResponse] = useState<unknown>(null);
  const [loading, setLoading] = useState(false);

  const [periodId, setPeriodId] = useState("PER0001");
  const [heroId, setHeroId] = useState("HER0001");

  async function callApi(
    url: string,
    options?: RequestInit
  ) {
    try {
      setLoading(true);

      const res = await fetch(url, options);

      const data = await res.json();

      setResponse(data);
    } catch (error) {
      setResponse({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Unknown error",
      });
    } finally {
      setLoading(false);
    }
  }

  /* =====================================
     Historical Period
  ===================================== */

  function createPeriod() {
    return callApi(
      "/api/historical-periods",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "Medieval India",
          startYear: "550 CE",
          endYear: "1526 CE",
          description:
            "Period after Ancient India.",
          status: "Draft",
        }),
      }
    );
  }

  function getAllPeriods() {
    return callApi(
      "/api/historical-periods"
    );
  }

  function getPeriod() {
    return callApi(
      `/api/historical-periods/${periodId}`
    );
  }

  function updatePeriod() {
    return callApi(
      `/api/historical-periods/${periodId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          significance:
            "Updated through Developer Dashboard.",
        }),
      }
    );
  }

  function deletePeriod() {
    return callApi(
      `/api/historical-periods/${periodId}`,
      {
        method: "DELETE",
      }
    );
  }

  /* =====================================
     Hero
  ===================================== */

  function createHero() {
    return callApi(
      "/api/heroes",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          name: "Chhatrapati Shivaji Maharaj",
          gender: "Male",
          biography:
            "Founder of the Maratha Empire.",
          kingdomId:
            "PASTE_VALID_KINGDOM_OBJECT_ID",
        }),
      }
    );
  }

  function getAllHeroes() {
    return callApi("/api/heroes");
  }

  function getHero() {
    return callApi(
      `/api/heroes/${heroId}`
    );
  }

  function updateHero() {
    return callApi(
      `/api/heroes/${heroId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          legacy:
            "Updated from Developer Dashboard.",
        }),
      }
    );
  }

  function deleteHero() {
    return callApi(
      `/api/heroes/${heroId}`,
      {
        method: "DELETE",
      }
    );
  }

  return (
    <main
      style={{
        padding: "2rem",
        fontFamily: "sans-serif",
      }}
    >
      <h1>🚀 VeerBharat Developer Dashboard</h1>

      <hr />

      <h2>Historical Period</h2>

      <input
        value={periodId}
        onChange={(e) =>
          setPeriodId(e.target.value)
        }
        placeholder="PER0001"
        style={{
          padding: "8px",
          width: "250px",
          marginBottom: "10px",
        }}
      />

      <br />

      <button onClick={createPeriod}>
        Create
      </button>

      <button onClick={getAllPeriods}>
        Get All
      </button>

      <button onClick={getPeriod}>
        Get One
      </button>

      <button onClick={updatePeriod}>
        Update
      </button>

      <button onClick={deletePeriod}>
        Delete
      </button>

      <hr />

      <h2>Hero</h2>

      <input
        value={heroId}
        onChange={(e) =>
          setHeroId(e.target.value)
        }
        placeholder="HER0001"
        style={{
          padding: "8px",
          width: "250px",
          marginBottom: "10px",
        }}
      />

      <br />

      <button onClick={createHero}>
        Create
      </button>

      <button onClick={getAllHeroes}>
        Get All
      </button>

      <button onClick={getHero}>
        Get One
      </button>

      <button onClick={updateHero}>
        Update
      </button>

      <button onClick={deleteHero}>
        Delete
      </button>

      <hr />

      <h2>Response</h2>

      {loading && <p>Loading...</p>}

      <pre
        style={{
          background: "#111",
          color: "#00ff66",
          padding: "20px",
          borderRadius: "10px",
          overflow: "auto",
          minHeight: "300px",
        }}
      >
        {JSON.stringify(
          response,
          null,
          2
        )}
      </pre>
    </main>
  );
}
