import { Header } from "@/components";
import Footer from "@/components/Footer";
import ContentLayout from "@/layouts/ContentLayout";
import LayoutContainer from "@/layouts/LayoutContainer";
import PageLayout from "@/layouts/PageLayout";
import { PaymentMethodComponent } from "./PaymentMethodComponent";

export default function PaymentMethod() {
  return (
    <PageLayout>
      <LayoutContainer>
        <Header />
        <ContentLayout>
          <PaymentMethodComponent />
        </ContentLayout>
        <Footer />
      </LayoutContainer>
    </PageLayout>
  );
}
