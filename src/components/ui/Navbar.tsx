import { auth, signOut } from "@/lib/auth";

const ChevronDown = ({ className = "" }) => (
  <span
    className={`inline-block w-2 h-2 border-r-2 border-b-2 border-gray-500 rotate-45 ${className}`}
  />
);

export default async function Navbar() {
  const session = await auth();

  if (!session?.user) return null;

  return (
    <header className="w-full bg-white border-t-4 border-b border-gray-100 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-8">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            ticktock
          </h1>
          <span className="text-sm font-medium text-slate-600 mt-1">
            Timesheets
          </span>
        </div>

        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/login" });
          }}
        >
          <button
            type="submit"
            className="flex items-center gap-2 hover:opacity-70 transition-opacity"
          >
            <span className="text-sm font-medium text-slate-600">
              {session.user.name}
            </span>
            <ChevronDown />
          </button>
        </form>
      </div>
    </header>
  );
}
