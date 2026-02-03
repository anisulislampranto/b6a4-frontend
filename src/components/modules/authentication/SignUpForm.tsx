import AuthCard from "./AuthCard";

export default function SignUpForm() {
    return (
        <div>
            <AuthCard
                title="Sign Up"
                subtitle="Create your MediStore account"
                fields={[
                    { label: "Full Name", type: "text", placeholder: "John Doe", name: "fullName" },
                    { label: "Email", type: "email", placeholder: "you@example.com", name: "email" },
                    { label: "Password", type: "password", placeholder: "••••••••", name: "password" },
                    { label: "Confirm Password", type: "password", placeholder: "••••••••", name: "confirmPassword" },
                ]}
                ctaText="Sign Up"
                linkText="Already have an account?"
                linkHref="/signin"
            />
        </div>
    )
}
