// import HeaderNavList from "./HeaderNavList/HeaderNavList";
// import Link from "next/link";
// import UserIcon from "@/app/assets/icons/User.svg";
// import LoginIcon from "@/app/assets/icons/login.svg";
// import css from "./Header.module.scss";


// const Header = () => {
//   return (
//     <header className={css.wrapperHeader}>
//       <div className={css.logo}>Logo</div>
//       <HeaderNavList />
//       <div className={css.authLinks}    >
//         <Link className={css.loginLink} href="/login">
//             <LoginIcon className={css.loginIcon} aria-hidden />
//             <span>Увійти</span>
//         </Link>
//         <Link className={css.registerLink} href="/register">
//           <UserIcon className={css.userIcon} aria-hidden />
//           <span>Зареєструватись</span>
//         </Link>
//       </div>
//     </header>
//   );
// };
// export default Header;

// Header.tsx
import HeaderNavList from "./HeaderNavList/HeaderNavList";
import Link from "next/link";
import UserIcon from "@/app/assets/icons/User.svg";
import LoginIcon from "@/app/assets/icons/login.svg";
import css from "./Header.module.scss";

const Header = () => {
  return (
    <header className={css.wrapperHeader}>
      <div className={css.logo}>Logo</div>

      {/* Навігація займає доступний простір, на мобілці може скролитись по осі X */}
      <div className={css.navWrap}>
        <HeaderNavList />
      </div>

      <div className={css.authLinks}>
        <Link className={css.loginLink} href="/login" aria-label="Увійти">
          <LoginIcon className={css.loginIcon} aria-hidden />
          <span className={css.label}>Увійти</span>
        </Link>
        <Link className={css.registerLink} href="/register" aria-label="Зареєструватись">
          <UserIcon className={css.userIcon} aria-hidden />
          <span className={css.label}>Зареєструватись</span>
        </Link>
      </div>
    </header>
  );
};

export default Header;


