import BridgePage from "@/pages/Bridge";
import { Explore } from "@/pages/Explore";
import { ExploreDetail } from "@/pages/Explore/ExploreDetail";
import FuturesPage from "@/pages/Futures";
import { History } from "@/pages/History";
import { HistoryDetail } from "@/pages/History/HistoryDetail";
import { Invite } from "@/pages/Invite";
import Market from "@/pages/Market";
import MintPage from "@/pages/Mint";
import PaymentMethod from "@/pages/PaymentMethod";
import { Invoice } from "@/pages/PaymentMethod/Invoice";
import ScanQR from "@/pages/PaymentMethod/ScanQR";
import ProfilePage from "@/pages/ProfilePage";
import Referral from "@/pages/Referral";
import Spin from "@/pages/Spin";
import { Reward } from "@/pages/Spin/Reward";
import { Version } from "@/pages/Version";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { ROUTES } from "./paths.route";

export const router = createBrowserRouter([
  // {
  //   path: ROUTES.SWAP,
  //   element: <Market />,
  // },
  {
    path: ROUTES.PROFILE,
    element: <ProfilePage />,
  },
  {
    path: "/bridge",
    element: <BridgePage />,
  },
  {
    path: ROUTES.MINT,
    element: <MintPage />,
  },
  {
    path: ROUTES.DASHBOARD,
    element: <Market />,
  },
  {
    path: ROUTES.REFERRAL,
    element: <Referral />,
  },
  {
    path: ROUTES.FUTURES,
    element: <FuturesPage />,
  },
  {
    path: ROUTES.PAYMENT_METHOD,
    element: <PaymentMethod />,
  },
  {
    path: ROUTES.EXPLORE,
    element: <Explore />,
  },
  {
    path: ROUTES.EXPLORE_DETAIL,
    element: <ExploreDetail />,
  },
  {
    path: ROUTES.HISTORY,
    element: <History />,
  },
  {
    path: ROUTES.HISTORY_DETAIL,
    element: <HistoryDetail />,
  },
  {
    path: ROUTES.INVOICE,
    element: <Invoice />,
  },
  {
    path: ROUTES.SCAN_QR,
    element: <ScanQR />,
  },
  {
    path: ROUTES.INVITE,
    element: <Invite />,
  },
  {
    path: ROUTES.SPIN,
    element: <Spin />,
  },
  {
    path: ROUTES.SPIN_REWARDS,
    element: <Reward />,
  },
  {
    path: ROUTES.VERSION,
    element: <Version />,
  },
  { path: "*", element: <Navigate to={ROUTES.DASHBOARD} /> },
]);
