import UserData from "./UserData";
import './header.css';

export default function Header() {
  return (
    <div className="header">
      <h1>Crystal beauty clear</h1>
      <UserData/>
    </div>
  );
}