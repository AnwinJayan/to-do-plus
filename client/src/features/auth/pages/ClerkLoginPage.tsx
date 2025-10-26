import { SignIn } from "@clerk/clerk-react";
import { Link } from "react-router-dom";

const SignInPage = () => (
  <>
    <SignIn path="/sign-in" signUpUrl="/sign-up" />
    <div className="custom-footer">
      <span className="custom-footer-text">Don't have an account?</span>
      <Link className="custom-footer-link" to="/sign-up">
        Sign up
      </Link>
    </div>
  </>
);

export default SignInPage;
