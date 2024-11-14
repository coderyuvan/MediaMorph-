import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-pink-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg ">
        <SignIn   />
      </div>
    </div>
  );
}
