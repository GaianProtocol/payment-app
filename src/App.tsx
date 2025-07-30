import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import GlobalLoading from "./components/GlobalLoading";
import Modal from "./components/Modal/Modal";
import SolanaAdapterProvider from "./providers/SolanaProvider";
import { router } from "./routes";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SolanaAdapterProvider>
        <GlobalLoading />
        {/* <FetchGlobal /> */}
        <Modal />
        <ToastContainer autoClose={1500} />
        <RouterProvider router={router} />
      </SolanaAdapterProvider>
    </QueryClientProvider>
  );
}
export default App;
