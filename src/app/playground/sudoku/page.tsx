import type { Metadata } from "next";
import Header from "@/components/header";
import SudokuGame from "./SudokuGame";

export const metadata: Metadata = {
  title: "Sudoku",
  description:
    "Play Sudoku — easy, medium, or hard. Fill every row, column, and 3×3 box with digits 1–9.",
};

export default function SudokuPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <SudokuGame />
    </main>
  );
}
