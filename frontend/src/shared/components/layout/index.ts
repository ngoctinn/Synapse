export { Footer } from "./components/footer";
export { HeaderUserDropdown } from "./components/header";
export { PageFooter } from "./components/page-footer";
// Header mặc định với Suspense - tự động hiển thị skeleton khi loading
export { HeaderWithSuspense as Header } from "./components/header/header-with-suspense";
// Export HeaderContainer riêng nếu cần control Suspense thủ công
export { HeaderContainer } from "./components/header/header-container";
export { HeaderLogo } from "./components/header/logo";
export { HeaderSkeleton } from "./components/header/skeleton";
