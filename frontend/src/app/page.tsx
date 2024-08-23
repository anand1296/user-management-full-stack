import UsersListPage from "./pages/users-list";

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-between m-4">
            <UsersListPage />
        </main>
    );
}
