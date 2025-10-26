import { SignUp } from "@clerk/clerk-react";
import { Link } from "react-router-dom";

const SignUpPage = () => (
  <>
    <SignUp path="/sign-up" />
    <div className="custom-footer">
      <span className="custom-footer-text">Already have an account?</span>
      <Link className="custom-footer-link" to="/sign-in">
        Sign in
      </Link>
    </div>
  </>
);

export default SignUpPage;
