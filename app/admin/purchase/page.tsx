import { Suspense } from "react";
import PurchaseForm from "@/components/PurchaseForm";

export default function AdminPurchasePage() {
  return (
    <main className="admin-section">
      <Suspense fallback={null}>
        <PurchaseForm />
      </Suspense>
    </main>
  );
}
