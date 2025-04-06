import { useEffect } from "react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useClerk,
} from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { background, image, header } from "./assets/image.js";
import "./App.css";

export default function App() {
  const navigate = useNavigate();
  const { user } = useClerk();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  return (
    <div className="container">
      <img src={header} className="header-image" alt="Header" />
      <div className="dev-image">
        <img src={image} alt="" className="image-div" />
      </div>
      <header className="sing-in-containaer">
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </header>
      <div className="footer footer-main-page">
        <img src={background} alt="" className="image-footer" />
      </div>
    </div>
  );
}
