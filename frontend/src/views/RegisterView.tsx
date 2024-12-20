import { Link } from "react-router-dom";

export default function RegisterView() {
  return (
    <>
        <div className="text-6xl">RegisterView</div>

        <nav>
            <Link to="/auth/login">
                Ya tienes una cuenta?, Inicia sesion
            </Link>
        </nav>
    </>
  )
}
