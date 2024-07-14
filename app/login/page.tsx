import Login from "@/components/auth/Login";

const LoginPage = () => (
    <main className="bg-gray-900 min-h-screen flex items-center justify-center">
        <div className="bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md">
            <h1 className="text-3xl font-bold mb-6 text-center">Login</h1>
            <Login />
        </div>
    </main>
);

export default LoginPage;