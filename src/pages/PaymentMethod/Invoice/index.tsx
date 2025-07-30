"use client";

import PageLayout from "@/layouts/PageLayout";
import { useParams } from "react-router-dom";
import { PaymentState } from "../PaymentState";

export function Invoice() {
  const { id } = useParams();

  if (id) {
    return (
      <PageLayout>
        <div className="fixed bottom-0 w-screen h-[100dvh] z-[100] bg-white overflow-y-auto">
          <div className="max-w-screen-sm mx-auto">
            <PaymentState invoiceId={Number(id)} />
          </div>
        </div>
      </PageLayout>
    );
  }
}
