import { ThemeProvider } from "./state/theme";
import { UIProvider } from "./state/ui";
import { ExpensesProvider } from "./state/expenses";
import { AppShell } from "./AppShell";

export default function App() {
  return (
    <ThemeProvider>
      <UIProvider>
        <ExpensesProvider>
          <AppShell />
        </ExpensesProvider>
      </UIProvider>
    </ThemeProvider>
  );
}