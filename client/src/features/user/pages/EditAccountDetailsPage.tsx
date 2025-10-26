import ChangeUserNameForm from "../components/ChangeUserNameForm";
import ProfileImageUploadForm from "../components/ProfileImageUploadForm";
import ChangePasswordForm from "../components/ChangePasswordForm";
import changeEmail from "../components/ChangeEmail";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";

export default function EditAccountDetailsPage() {
  const user = useSelector((state: RootState) => state.user);

  if (!user._id) return null;

  return (
    <div className="max-w-xl mx-auto mt-8 space-y-8">
      <h2 className="text-3xl font-bold mb-6 text-center">
        Edit Account Details
      </h2>
      <div className="card bg-base-100 shadow-md p-6">
        <h3 className="card-title text-lg mb-4">Change Username</h3>
        <ChangeUserNameForm />
      </div>
      <div className="card bg-base-100 shadow-md p-6">
        <h3 className="card-title text-lg mb-4">Change Email</h3>
        {changeEmail()}
      </div>
      <div className="card bg-base-100 shadow-md p-6">
        <h3 className="card-title text-lg mb-4">Update Profile Image</h3>
        <ProfileImageUploadForm user={user} />
      </div>
      <div className="card bg-base-100 shadow-md p-6">
        <h3 className="card-title text-lg mb-4">Change Password</h3>
        <ChangePasswordForm />
      </div>
    </div>
  );
}
