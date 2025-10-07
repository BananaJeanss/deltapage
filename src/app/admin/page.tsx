import { auth } from "@/auth";

export default async function AdminPage() {
    const session = await auth();
    if (session?.user?.role !== "admin") {
        return <div className="p-4">Access Denied</div>;
    }

    return (
        <div className="p-4">
            <h1>Admin Panel</h1>
            <p>Admin Panel</p>
            <p>yadayada work in progress lalalalala</p>
        </div>
    );
}