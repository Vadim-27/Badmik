import HeaderNavList from "./HeaderNavList/HeaderNavList";
import Link from "next/link";
import UserIcon from "@/app/assets/icons/User.svg";
import LoginIcon from "@/app/assets/icons/login.svg";
import css from "./Header.module.scss";


const Header = () => {
  return (
    <header className={css.wrapperHeader}>
      <div className={css.logo}>Logo</div>
      <HeaderNavList />
      <div className={css.authLinks}    >
        <Link className={css.loginLink} href="/login">
            <LoginIcon className={css.loginIcon} aria-hidden />
            <span>Login</span>
        </Link>
        <Link className={css.registerLink} href="/register">
          <UserIcon className={css.userIcon} aria-hidden />
          <span>Зареєструватись</span>
        </Link>
      </div>
    </header>
  );
};
export default Header;
