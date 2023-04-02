import { AuthProvider } from "./navigation/AuthProvider";
import { Provider as PaperProvider } from "react-native-paper";
import Routes from "./navigation/Routes";

export default function App() {
  return (
    <PaperProvider>
      <AuthProvider>
        <Routes />
      </AuthProvider>
    </PaperProvider>
  );
}
