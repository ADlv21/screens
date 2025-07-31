import { LoginForm } from '@/components/auth/login-form'

export default function GoogleLoginPage() {
    return (
        <div className="min-h-screen bg-slate-950 text-white overflow-hidden">
            <div className="fixed inset-0 bg-gradient-to-br from-indigo-900/20 via-slate-950 to-blue-900/20 pointer-events-none" />
            <div className="relative z-10">
                <LoginForm />
            </div>
        </div>
    )
} 