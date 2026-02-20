import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabaseServerClient";
import ProfileClientPage from "./ProfileClientPage";



export default async function CheckoutPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  return <ProfileClientPage user={user} />;
}