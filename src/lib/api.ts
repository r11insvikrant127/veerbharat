export async function getHeroes() {
  const response = await fetch("/api/heroes");

  if (!response.ok) {
    throw new Error("Failed to fetch heroes.");
  }

  return response.json();
}