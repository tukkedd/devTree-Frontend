import { Link } from "react-router-dom"
export default function LoginView() {
  return (
    <>


        <nav>
            <Link to="/auth/register">
                No tienes una cuenta?, Crea una aqui
            </Link>
        </nav>
    </>
  )
}
