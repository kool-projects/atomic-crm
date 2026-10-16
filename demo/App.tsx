import { CRM } from "@/components/atomic-crm/root/CRM";
import {
  authProvider,
  dataProvider,
} from "@/components/atomic-crm/providers/fakerest";
import { localStorageStore } from "ra-core";

// The demo data lives in memory and is rebuilt on every reload, but the
// settings (title, color scheme, view choices) are kept in the browser so
// they survive a page refresh, as they do with a real database.
const store = localStorageStore(undefined, "CRM-demo");

const App = () => (
  <CRM dataProvider={dataProvider} authProvider={authProvider} store={store} />
);

export default App;
