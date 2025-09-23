import { createContext, useContext } from 'react';
import { ThemeProvider as NextThemeProvider } from 'next-themes';

const ThemeContext = createContext({});

export function ThemeProvider({ children, ...props }: React.ComponentProps<typeof NextThemeProvider>) {
  return (
    <NextThemeProvider 
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange={false}
      {...props}
    >
      {children}
    </NextThemeProvider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  return context;
};