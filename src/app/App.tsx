import { AppProviders } from "./providers";
import { AppRouter } from "./router";

const App = (): JSX.Element => (
  <AppProviders>
    <AppRouter />
  </AppProviders>
);

export default App;
