import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";

const Register = () => {
  const [data, setData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const url = "/api/user/register";
      const { data: res } = await axios.post(url, data);
      toast.success(res.message || "Registered successfully");
      setData({ email: "", firstName: "", lastName: "", password: "" });
    } catch (error) {
      if (error.response && error.response.status >= 300 && error.response.status <= 500) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Unable to register right now");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="min-h-screen px-4 py-8" style={{ background: "var(--bg)", color: "var(--text-main)" }}>
      <div className="mx-auto flex min-h-[80vh] max-w-md items-center justify-center">
        <div className="w-full rounded-xl p-6 shadow" style={{ background: "var(--panel)", border: "1px solid var(--border)" }}>
          <h1 className="mb-5 text-xl font-bold">Create an account</h1>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="mb-2 block text-sm">Your email</label>
              <input onChange={handleChange} value={data.email} type="email" name="email" className="w-full rounded-lg border p-2.5" style={{ background: "var(--panel-soft)", borderColor: "var(--border)", color: "var(--text-main)" }} placeholder="name@company.com" required />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm">First Name</label>
                <input onChange={handleChange} value={data.firstName} type="text" name="firstName" placeholder="John" className="w-full rounded-lg border p-2.5" style={{ background: "var(--panel-soft)", borderColor: "var(--border)", color: "var(--text-main)" }} required />
              </div>
              <div>
                <label className="mb-2 block text-sm">Last Name</label>
                <input onChange={handleChange} value={data.lastName} type="text" name="lastName" placeholder="Doe" className="w-full rounded-lg border p-2.5" style={{ background: "var(--panel-soft)", borderColor: "var(--border)", color: "var(--text-main)" }} required />
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm">Password</label>
              <div className="flex gap-2">
                <input onChange={handleChange} value={data.password} type={showPassword ? "text" : "password"} name="password" placeholder="••••••••" className="w-full rounded-lg border p-2.5" style={{ background: "var(--panel-soft)", borderColor: "var(--border)", color: "var(--text-main)" }} required />
                <button type="button" className="rounded-lg border px-3" style={{ borderColor: "var(--border)" }} onClick={() => setShowPassword((v) => !v)}>
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>
            <button type="submit" disabled={isSubmitting} className="w-full rounded-lg bg-blue-600 px-5 py-2.5 text-white hover:bg-blue-700 disabled:opacity-60">
              {isSubmitting ? "Creating account..." : "Create an account"}
            </button>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              Already have an account? <Link to="/login" className="font-medium text-blue-500 hover:underline">Login here</Link>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Register;
