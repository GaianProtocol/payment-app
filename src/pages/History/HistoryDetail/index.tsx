import { Header } from "@/components";
import Footer from "@/components/Footer";
import ContentLayout from "@/layouts/ContentLayout";
import LayoutContainer from "@/layouts/LayoutContainer";
import PageLayout from "@/layouts/PageLayout";
import { useParams } from "react-router-dom";

import { PaymentState } from "@/pages/PaymentMethod/PaymentState";

interface RowFieldProps {
  label: string;
  value: React.ReactNode;
  extra?: React.ReactNode;
}

export const HistoryDetail = () => {
  const { id } = useParams();

  return (
    <PageLayout authRequired>
      <LayoutContainer>
        <Header />
        <ContentLayout>
          <div className="max-w-screen-sm mx-auto pb-16 pt-4 px-2 w-full">
            <div className=" relative bg-white border rounded-3xl max-w-screen-sm  mx-auto w-full">
              <div className="relative z-10">
                <PaymentState invoiceId={Number(id)} />
              </div>
            </div>
          </div>
        </ContentLayout>
        <Footer />
      </LayoutContainer>
    </PageLayout>
  );
};
