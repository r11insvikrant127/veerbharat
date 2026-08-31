import readline from "node:readline/promises";
import {
  stdin as input,
  stdout as output,
} from "node:process";

export const rl = readline.createInterface({
  input,
  output,
});

export async function ask(
  question: string
): Promise<string> {
  return (
    await rl.question(question)
  ).trim();
}

export async function askRequired(
  question: string
): Promise<string> {
  while (true) {
    const value = await ask(question);

    if (value.length > 0) {
      return value;
    }

    console.log(
      "This field is required."
    );
  }
}

export async function askYesNo(
  question: string
): Promise<boolean> {
  while (true) {
    const answer = (
      await ask(question)
    ).toLowerCase();

    if (
      answer === "y" ||
      answer === "yes"
    ) {
      return true;
    }

    if (
      answer === "n" ||
      answer === "no"
    ) {
      return false;
    }

    console.log(
      "Please enter y or n."
    );
  }
}

export async function askOptional(
  question: string
): Promise<string | null> {
  const value = await ask(question);

  return value.length > 0
    ? value
    : null;
}

export async function askOptionalNumber(
  question: string
): Promise<number | null> {
  while (true) {
    const value = await ask(question);

    if (value === "") {
      return null;
    }

    const number = Number(value);

    if (
      Number.isInteger(number) &&
      Number.isSafeInteger(number)
    ) {
      return number;
    }

    console.log(
      "Please enter a valid number or leave it blank."
    );
  }
}

export function closePrompt(): void {
  rl.close();
}