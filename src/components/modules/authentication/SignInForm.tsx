import AuthCard from "./AuthCard";

export default function SignInForm() {
    return (
        <div>
            <AuthCard
                title="Sign In"
                subtitle="Access your MediStore account"
                fields={[
                    { label: "Email", type: "email", placeholder: "you@example.com", name: "email" },
                    { label: "Password", type: "password", placeholder: "••••••••", name: "password" },
                ]}
                ctaText="Login"
                linkText="Don't have an account?"
                linkHref="/signup"
            />
        </div>
    )
}
