import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden px-4">

      {/* Background */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background: "var(--gradient-mesh)",
        }}
      />

      {/* Clerk Sign In */}
      <div className="relative z-10">
        <SignIn />
      </div>

    </div>
  );
}