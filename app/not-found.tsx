import { redirect } from "next/navigation";

// redirect to home page
export default function NotFound() {
  return redirect('/');
}
