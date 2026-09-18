import { SignIn } from '@clerk/nextjs'

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0a0a] via-[#1a1a2e] to-[#0f0f1e]">
      <SignIn 
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "bg-[#1a1a2e] border border-[#2a2a3e]",
          }
        }}
        routing="path"
        path="/sign-in"
        signUpUrl="/sign-up"
      />
    </div>
  )
}
